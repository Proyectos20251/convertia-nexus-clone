
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, PlayCircle, PauseCircle, FileText, RotateCcw, Check, X, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

export default function TimeManagement() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 5),
    to: addDays(new Date(2025, 4, 5), 4),
  });

  // Mock data for absences
  const absences = [
    {
      id: 1,
      type: "Vacaciones",
      startDate: "10/05/2025",
      endDate: "20/05/2025",
      status: "approved",
    },
    {
      id: 2,
      type: "Baja médica",
      startDate: "01/07/2025",
      endDate: "02/07/2025",
      status: "pending",
    },
    {
      id: 3,
      type: "Permiso personal",
      startDate: "15/06/2025",
      endDate: "15/06/2025",
      status: "rejected",
      reason: "Alta demanda de trabajo",
    },
  ];

  // Mock data for time records
  const timeRecords = [
    {
      date: "01/05/2025",
      clockIn: "09:02",
      clockOut: "18:05",
      total: "9h 03m",
    },
    {
      date: "02/05/2025",
      clockIn: "08:55",
      clockOut: "17:45",
      total: "8h 50m",
    },
    {
      date: "03/05/2025",
      clockIn: "09:15",
      clockOut: "18:10",
      total: "8h 55m",
    },
    {
      date: "04/05/2025",
      clockIn: "08:45",
      clockOut: "17:30",
      total: "8h 45m",
    },
  ];

  // Function to get today's date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return time;
  };

  // Handle clock in/out
  const handleClockInOut = () => {
    if (clockedIn) {
      setClockedIn(false);
      toast.success("Has registrado tu salida a las " + getCurrentDateTime());
    } else {
      const time = getCurrentDateTime();
      setClockedIn(true);
      setClockInTime(time);
      toast.success("Has registrado tu entrada a las " + time);
    }
  };

  // Submit time off request
  const handleSubmitTimeOff = () => {
    if (dateRange?.from && dateRange?.to) {
      toast.success("Solicitud de ausencia enviada correctamente");
    } else {
      toast.error("Por favor selecciona un rango de fechas");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión del Tiempo</h1>

        <Tabs defaultValue="registro" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="registro">Registro</TabsTrigger>
            <TabsTrigger value="ausencias">Ausencias</TabsTrigger>
            <TabsTrigger value="informes">Informes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registro">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Calendario</CardTitle>
                    <CardDescription>Mayo 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">
                      Registro de hoy
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(), "EEEE, d 'de' MMMM", {locale: es})}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full border-8 border-gray-100 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-700">
                          {clockedIn ? clockInTime : "--:--"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {clockedIn ? "Entrada" : "No registrado"}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mb-4"
                      variant={clockedIn ? "destructive" : "default"}
                      onClick={handleClockInOut}
                    >
                      {clockedIn ? (
                        <>
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Registrar salida
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Registrar entrada
                        </>
                      )}
                    </Button>
                    
                    {clockedIn && (
                      <div className="text-center text-sm text-gray-500 mt-4">
                        Entrada registrada a las {clockInTime}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Resumen semanal</CardTitle>
                    <CardDescription>Esta semana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Horas trabajadas</span>
                          <span className="text-sm font-medium">35h 33m / 40h</span>
                        </div>
                        <Progress value={89} />
                        <div className="text-xs text-gray-500">
                          89% de la jornada semanal completada
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h3 className="text-sm font-medium mb-3">
                          Últimos registros
                        </h3>
                        <div className="space-y-3">
                          {timeRecords.slice(0, 3).map((record, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium">{record.date}</div>
                                <div className="text-xs text-gray-500">
                                  {record.clockIn} - {record.clockOut}
                                </div>
                              </div>
                              <Badge variant="outline">{record.total}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
                        
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Historial de registros</CardTitle>
                <CardDescription>
                  Registro completo de entradas y salidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs uppercase tracking-wider border-b text-gray-500">
                        <th className="py-3 px-4 text-left">Fecha</th>
                        <th className="py-3 px-4 text-left">Entrada</th>
                        <th className="py-3 px-4 text-left">Salida</th>
                        <th className="py-3 px-4 text-left">Tiempo total</th>
                        <th className="py-3 px-4 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeRecords.map((record, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{record.date}</div>
                          </td>
                          <td className="py-3 px-4">{record.clockIn}</td>
                          <td className="py-3 px-4">{record.clockOut}</td>
                          <td className="py-3 px-4">{record.total}</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              Completado
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ausencias">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">Ausencias</CardTitle>
                      <CardDescription>
                        Solicitudes y registro de ausencias
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Solicitar ausencia
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Solicitud de ausencia</DialogTitle>
                          <DialogDescription>
                            Complete los detalles para solicitar un nuevo periodo de ausencia.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo de ausencia</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vacation">Vacaciones</SelectItem>
                                <SelectItem value="sick">Baja por enfermedad</SelectItem>
                                <SelectItem value="personal">Permiso personal</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Periodo</label>
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Justificación (opcional)</label>
                            <Input placeholder="Detalles sobre la ausencia" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancelar</Button>
                          <Button onClick={handleSubmitTimeOff}>Enviar solicitud</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs uppercase tracking-wider border-b text-gray-500">
                            <th className="py-3 px-4 text-left">Tipo</th>
                            <th className="py-3 px-4 text-left">Fechas</th>
                            <th className="py-3 px-4 text-left">Estado</th>
                            <th className="py-3 px-4 text-left">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {absences.map((absence) => (
                            <tr key={absence.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="font-medium">{absence.type}</div>
                              </td>
                              <td className="py-3 px-4">
                                {absence.startDate} al {absence.endDate}
                              </td>
                              <td className="py-3 px-4">
                                {absence.status === "approved" ? (
                                  <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
                                ) : absence.status === "pending" ? (
                                  <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">Rechazado</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4 flex gap-2">
                                {absence.status === "pending" && (
                                  <>
                                    <Button size="sm" variant="outline">
                                      <FileText className="h-3.5 w-3.5" />
                                      <span className="sr-only">Ver detalles</span>
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <RotateCcw className="h-3.5 w-3.5" />
                                      <span className="sr-only">Cancelar</span>
                                    </Button>
                                  </>
                                )}
                                {absence.status !== "pending" && (
                                  <Button size="sm" variant="outline">
                                    <FileText className="h-3.5 w-3.5" />
                                    <span className="sr-only">Ver detalles</span>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Días disponibles</CardTitle>
                    <CardDescription>Saldos actuales</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Vacaciones</span>
                        <span className="text-sm font-medium">18 / 22 días</span>
                      </div>
                      <Progress value={18 / 22 * 100} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Días personales</span>
                        <span className="text-sm font-medium">2 / 3 días</span>
                      </div>
                      <Progress value={2/3 * 100} />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Próximas ausencias</h3>
                      {absences
                        .filter(a => a.status === "approved")
                        .map((absence) => (
                          <div key={absence.id} className="flex items-center mb-2 text-sm">
                            <CalendarCheck className="h-4 w-4 mr-2 text-green-600" />
                            <span>{absence.type}: {absence.startDate} - {absence.endDate}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Solicitudes pendientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {absences.filter(a => a.status === "pending").length > 0 ? (
                      absences
                        .filter(a => a.status === "pending")
                        .map((absence) => (
                          <div key={absence.id} className="flex justify-between items-center p-3 border rounded-md mb-2">
                            <div>
                              <div className="font-medium">{absence.type}</div>
                              <div className="text-sm text-gray-500">
                                {absence.startDate} - {absence.endDate}
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay solicitudes pendientes
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="informes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Informes de tiempo</CardTitle>
                <CardDescription>
                  Análisis y resúmenes de tus registros de tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Este mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Días trabajados:</span>
                          <span className="font-medium">18 días</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Horas totales:</span>
                          <span className="font-medium">144 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Horas extra:</span>
                          <span className="font-medium">4.5 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Ausencias:</span>
                          <span className="font-medium">2 días</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver informe detallado
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Este año</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Días trabajados:</span>
                          <span className="font-medium">85 días</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Horas totales:</span>
                          <span className="font-medium">680 horas</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Vacaciones tomadas:</span>
                          <span className="font-medium">4 días</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Días personales:</span>
                          <span className="font-medium">1 día</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Ver informe detallado
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Informes personalizados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">
                        Genera informes personalizados seleccionando el periodo y el tipo de informe.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Periodo</label>
                          <Select defaultValue="month">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="week">Semanal</SelectItem>
                              <SelectItem value="month">Mensual</SelectItem>
                              <SelectItem value="quarter">Trimestral</SelectItem>
                              <SelectItem value="year">Anual</SelectItem>
                              <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Tipo de informe</label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Completo</SelectItem>
                              <SelectItem value="hours">Solo horas</SelectItem>
                              <SelectItem value="absences">Solo ausencias</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          Generar informe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
