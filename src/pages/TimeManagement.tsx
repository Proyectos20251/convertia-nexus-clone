
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, Check } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Interfaces para los datos
interface TimeRecord {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  created_at: string;
  updated_at: string;
}

interface Absence {
  id: string;
  user_id: string;
  type_id: string;
  start_date: string;
  end_date: string;
  status: string;
  comment?: string;
}

interface AbsenceType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
}

export default function TimeManagement() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTimeRecord, setActiveTimeRecord] = useState<TimeRecord | null>(null);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [myAbsences, setMyAbsences] = useState<any[]>([]);
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
  const [teamAbsences, setTeamAbsences] = useState<any[]>([]);
  
  const form = useForm({
    defaultValues: {
      type_id: "",
      start_date: new Date(),
      end_date: new Date(),
      comment: ""
    }
  });
  
  // Cargar tipos de ausencias al iniciar
  useEffect(() => {
    const fetchAbsenceTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('absence_types')
          .select('*');
          
        if (error) throw error;
        
        setAbsenceTypes(data);
      } catch (error) {
        console.error("Error fetching absence types:", error);
        toast.error("Error al cargar los tipos de ausencia");
      }
    };
    
    fetchAbsenceTypes();
  }, []);
  
  // Cargar registro de jornada activo y registros históricos
  useEffect(() => {
    if (!user) return;
    
    const fetchTimeRecords = async () => {
      try {
        // Obtener el registro activo (sin check_out)
        const { data: activeRecord, error: activeError } = await supabase
          .from('time_records')
          .select('*')
          .eq('user_id', user.id)
          .is('check_out', null)
          .order('check_in', { ascending: false })
          .maybeSingle();
        
        if (activeError) throw activeError;
        setActiveTimeRecord(activeRecord);
        
        // Obtener el historial de registros
        const { data: records, error: recordsError } = await supabase
          .from('time_records')
          .select('*')
          .eq('user_id', user.id)
          .not('check_out', 'is', null)
          .order('check_in', { ascending: false })
          .limit(10);
        
        if (recordsError) throw recordsError;
        setTimeRecords(records || []);
      } catch (error) {
        console.error("Error fetching time records:", error);
        toast.error("Error al cargar los registros de jornada");
      }
    };
    
    // Obtener las ausencias del usuario
    const fetchMyAbsences = async () => {
      try {
        const { data, error } = await supabase
          .from('absences')
          .select(`
            *,
            absence_types (
              id, name, color
            )
          `)
          .eq('user_id', user.id)
          .order('start_date', { ascending: false });
        
        if (error) throw error;
        setMyAbsences(data || []);
      } catch (error) {
        console.error("Error fetching absences:", error);
        toast.error("Error al cargar las ausencias");
      }
    };
    
    // Obtener las ausencias del equipo
    const fetchTeamAbsences = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('absences')
          .select(`
            *,
            profiles:user_id (
              id, full_name
            ),
            absence_types (
              id, name, color
            )
          `)
          .gte('end_date', today) // Solo ausencias actuales o futuras
          .order('start_date', { ascending: true });
        
        if (error) throw error;
        setTeamAbsences(data || []);
      } catch (error) {
        console.error("Error fetching team absences:", error);
        toast.error("Error al cargar las ausencias del equipo");
      }
    };
    
    fetchTimeRecords();
    fetchMyAbsences();
    fetchTeamAbsences();
    
    // Configurar suscripción para cambios en tiempo real
    const timeRecordsSubscription = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'time_records',
        filter: `user_id=eq.${user.id}` 
      }, () => {
        fetchTimeRecords();
      })
      .subscribe();
      
    const absencesSubscription = supabase
      .channel('custom-absences-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'absences'
      }, () => {
        fetchMyAbsences();
        fetchTeamAbsences();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(timeRecordsSubscription);
      supabase.removeChannel(absencesSubscription);
    };
  }, [user]);
  
  // Función para registrar entrada/salida
  const handleClockToggle = async () => {
    if (!user) return;
    
    try {
      if (!activeTimeRecord) {
        // Registrar entrada
        const { data, error } = await supabase
          .from('time_records')
          .insert({
            user_id: user.id,
            check_in: new Date().toISOString()
          })
          .select()
          .single();
          
        if (error) throw error;
        setActiveTimeRecord(data);
        toast.success("Has registrado tu hora de entrada correctamente");
      } else {
        // Registrar salida
        const { error } = await supabase
          .from('time_records')
          .update({
            check_out: new Date().toISOString()
          })
          .eq('id', activeTimeRecord.id);
          
        if (error) throw error;
        setActiveTimeRecord(null);
        toast.success("Has registrado tu hora de salida correctamente");
      }
    } catch (error) {
      console.error("Error registering time:", error);
      toast.error("Error al registrar tu hora");
    }
  };
  
  // Función para solicitar ausencia
  const handleAbsenceRequest = async (formData: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('absences')
        .insert({
          user_id: user.id,
          type_id: formData.type_id,
          start_date: formData.start_date.toISOString().split('T')[0],
          end_date: formData.end_date.toISOString().split('T')[0],
          comment: formData.comment
        });
        
      if (error) throw error;
      
      toast.success("Solicitud de ausencia enviada correctamente");
      form.reset();
    } catch (error) {
      console.error("Error requesting absence:", error);
      toast.error("Error al enviar la solicitud de ausencia");
    }
  };
  
  // Función para formatear duración
  const formatDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "En curso";
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffInMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Función para formatear hora
  const formatTime = (dateString: string | null) => {
    if (!dateString) return "--:--";
    try {
      return format(new Date(dateString), "HH:mm", { locale: es });
    } catch (error) {
      return "--:--";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión del Tiempo</h1>

        <Tabs defaultValue="registro" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="registro">Registro de Jornada</TabsTrigger>
            <TabsTrigger value="ausencias">Ausencias</TabsTrigger>
            <TabsTrigger value="calendario">Calendario del Equipo</TabsTrigger>
          </TabsList>
          
          {/* Registro de jornada tab */}
          <TabsContent value="registro">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Control de jornada</CardTitle>
                  <CardDescription>
                    Registra tu entrada y salida del trabajo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="text-4xl font-bold mb-2 text-gray-800">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    
                    <Button 
                      className={activeTimeRecord ? "bg-red-500 hover:bg-red-600" : "bg-teal-950 hover:bg-teal-900"} 
                      size="lg"
                      onClick={handleClockToggle}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {activeTimeRecord ? "Registrar salida" : "Registrar entrada"}
                    </Button>
                    
                    {activeTimeRecord && (
                      <div className="mt-4 text-sm text-gray-600">
                        Entrada registrada a las {formatTime(activeTimeRecord.check_in)}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Últimos registros</h4>
                    <ul className="space-y-3">
                      {timeRecords.slice(0, 3).map((record) => (
                        <li key={record.id} className="bg-gray-50 p-3 rounded-md flex justify-between">
                          <span>{formatDate(record.check_in)}</span>
                          <span>{formatDuration(record.check_in, record.check_out)}</span>
                        </li>
                      ))}
                      {timeRecords.length === 0 && (
                        <li className="bg-gray-50 p-3 rounded-md text-center text-gray-500">
                          No hay registros recientes
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Historial de registros</CardTitle>
                  <CardDescription>
                    Resumen de tus horas registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Entrada</TableHead>
                          <TableHead>Salida</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {timeRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.check_in)}</TableCell>
                            <TableCell>{formatTime(record.check_in)}</TableCell>
                            <TableCell>{formatTime(record.check_out)}</TableCell>
                            <TableCell className="font-medium">{formatDuration(record.check_in, record.check_out)}</TableCell>
                          </TableRow>
                        ))}
                        {timeRecords.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                              No hay registros disponibles
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Ausencias tab */}
          <TabsContent value="ausencias">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Balance de días libres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Vacaciones</div>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-800 mr-2">18</span>
                        <span className="text-sm text-gray-500">días disponibles</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="text-red-500">2</span> días usados este año
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Trabajo remoto</div>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold text-gray-800 mr-2">6</span>
                        <span className="text-sm text-gray-500">días disponibles</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="text-red-500">4</span> días usados este año
                      </div>
                    </div>
                    
                    <div>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAbsenceRequest)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="type_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de ausencia</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {absenceTypes.map(type => (
                                      <SelectItem key={type.id} value={type.id}>
                                        {type.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full bg-teal-950 hover:bg-teal-900">
                            Solicitar ausencia
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Mis solicitudes de ausencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Fecha inicio</TableHead>
                          <TableHead>Fecha fin</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myAbsences.map((absence) => (
                          <TableRow key={absence.id}>
                            <TableCell>
                              {absence.absence_types.name}
                            </TableCell>
                            <TableCell>{formatDate(absence.start_date)}</TableCell>
                            <TableCell>{formatDate(absence.end_date)}</TableCell>
                            <TableCell>
                              <Badge className={
                                absence.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : absence.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }>
                                {absence.status === "approved" ? "Aprobada" : 
                                 absence.status === "pending" ? "Pendiente" : "Rechazada"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {myAbsences.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-6">
                              No tienes solicitudes de ausencia
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Calendario del equipo tab */}
          <TabsContent value="calendario">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Calendario</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border w-[290px] mx-auto"
                    classNames={{
                      day_selected: "bg-teal-950 text-primary-foreground hover:bg-teal-900",
                      day_today: "bg-accent text-accent-foreground",
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Ausencias del equipo</CardTitle>
                  <CardDescription>
                    {date && date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {teamAbsences.filter(absence => {
                      if (!date) return false;
                      const selectedDate = date.toISOString().split('T')[0];
                      return absence.start_date <= selectedDate && absence.end_date >= selectedDate;
                    }).map((absence) => (
                      <li key={absence.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div className="font-medium">{absence.profiles?.full_name || "Usuario"}</div>
                          <Badge style={{ 
                            backgroundColor: `${absence.absence_types.color}20`,
                            color: absence.absence_types.color
                          }}>
                            {absence.absence_types.name}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {absence.start_date === absence.end_date
                            ? `${formatDate(absence.start_date)}`
                            : `${formatDate(absence.start_date)} - ${formatDate(absence.end_date)}`
                          }
                        </div>
                      </li>
                    ))}
                    {teamAbsences.filter(absence => {
                      if (!date) return false;
                      const selectedDate = date.toISOString().split('T')[0];
                      return absence.start_date <= selectedDate && absence.end_date >= selectedDate;
                    }).length === 0 && (
                      <li className="text-center py-4 text-gray-500">
                        No hay ausencias programadas para esta fecha
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
