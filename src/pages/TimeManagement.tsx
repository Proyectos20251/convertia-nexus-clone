
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, Check } from "lucide-react";

export default function TimeManagement() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isClockIn, setIsClockIn] = useState(false);
  
  // Mock data
  const today = new Date();
  const lastClockIn = new Date(today);
  lastClockIn.setHours(9, 5, 0);
  
  const teamAbsences = [
    {
      id: 1,
      name: "Carlos López",
      type: "Vacaciones",
      startDate: "2023-05-15",
      endDate: "2023-05-22",
      status: "Aprobada",
    },
    {
      id: 2,
      name: "Laura Castro",
      type: "Baja médica",
      startDate: "2023-05-10",
      endDate: "2023-05-12",
      status: "Aprobada",
    },
    {
      id: 3,
      name: "Miguel Torres",
      type: "Trabajo remoto",
      startDate: "2023-05-08",
      endDate: "2023-05-08",
      status: "Aprobada",
    },
  ];
  
  const handleClockToggle = () => {
    const action = isClockIn ? "out" : "in";
    setIsClockIn(!isClockIn);
    
    toast({
      title: `Registro exitoso`,
      description: `Has registrado tu hora de ${action === "in" ? "entrada" : "salida"} correctamente.`,
      className: "bg-success-50 text-success-900 border-success-200",
    });
  };
  
  // Mock absence requests
  const myAbsences = [
    {
      id: 1,
      type: "Vacaciones",
      startDate: "2023-06-10",
      endDate: "2023-06-17",
      status: "Pendiente",
    },
    {
      id: 2,
      type: "Trabajo remoto",
      startDate: "2023-05-02",
      endDate: "2023-05-02",
      status: "Aprobada",
    },
    {
      id: 3,
      type: "Asuntos personales",
      startDate: "2023-04-15",
      endDate: "2023-04-15",
      status: "Aprobada",
    },
  ];
  
  // Mock time logs
  const timeLogs = [
    {
      date: "2023-05-08",
      clockIn: "09:05",
      clockOut: "18:10",
      totalHours: "09:05",
    },
    {
      date: "2023-05-05",
      clockIn: "09:00",
      clockOut: "18:00",
      totalHours: "09:00",
    },
    {
      date: "2023-05-04",
      clockIn: "08:55",
      clockOut: "18:15",
      totalHours: "09:20",
    },
    {
      date: "2023-05-03",
      clockIn: "09:10",
      clockOut: "18:05",
      totalHours: "08:55",
    },
    {
      date: "2023-05-02",
      clockIn: "09:00",
      clockOut: "18:00",
      totalHours: "09:00",
    },
  ];

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
                      className={isClockIn ? "bg-red-500 hover:bg-red-600" : "bg-convertia-600 hover:bg-convertia-700"} 
                      size="lg"
                      onClick={handleClockToggle}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {isClockIn ? "Registrar salida" : "Registrar entrada"}
                    </Button>
                    
                    {isClockIn && (
                      <div className="mt-4 text-sm text-gray-600">
                        Entrada registrada a las {lastClockIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Últimos registros</h4>
                    <ul className="space-y-3">
                      {timeLogs.slice(0, 3).map((log, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-md flex justify-between">
                          <span>{log.date}</span>
                          <span>{log.totalHours}</span>
                        </li>
                      ))}
                      <li className="text-center">
                        <button className="text-sm text-convertia-600 hover:underline">
                          Ver historial completo
                        </button>
                      </li>
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
                    <table className="w-full min-w-[400px]">
                      <thead>
                        <tr className="border-b text-xs uppercase text-gray-500">
                          <th className="px-4 py-3 text-left font-medium">Fecha</th>
                          <th className="px-4 py-3 text-left font-medium">Entrada</th>
                          <th className="px-4 py-3 text-left font-medium">Salida</th>
                          <th className="px-4 py-3 text-left font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeLogs.map((log, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{log.date}</td>
                            <td className="px-4 py-3">{log.clockIn}</td>
                            <td className="px-4 py-3">{log.clockOut}</td>
                            <td className="px-4 py-3 font-medium">{log.totalHours}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                      <Button className="w-full bg-convertia-600 hover:bg-convertia-700">
                        Solicitar ausencia
                      </Button>
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
                    <table className="w-full min-w-[400px]">
                      <thead>
                        <tr className="border-b text-xs uppercase text-gray-500">
                          <th className="px-4 py-3 text-left font-medium">Tipo</th>
                          <th className="px-4 py-3 text-left font-medium">Fecha inicio</th>
                          <th className="px-4 py-3 text-left font-medium">Fecha fin</th>
                          <th className="px-4 py-3 text-left font-medium">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myAbsences.map((absence) => (
                          <tr key={absence.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">{absence.type}</td>
                            <td className="px-4 py-3">{absence.startDate}</td>
                            <td className="px-4 py-3">{absence.endDate}</td>
                            <td className="px-4 py-3">
                              <Badge className={
                                absence.status === "Aprobada"
                                  ? "bg-green-100 text-green-800"
                                  : absence.status === "Pendiente"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }>
                                {absence.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                      day_selected: "bg-convertia-600 text-primary-foreground hover:bg-convertia-600",
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
                    {teamAbsences.length > 0 ? (
                      teamAbsences.map((absence) => (
                        <li key={absence.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div className="font-medium">{absence.name}</div>
                            <Badge className={
                              absence.type === "Vacaciones"
                                ? "bg-blue-100 text-blue-800"
                                : absence.type === "Baja médica"
                                ? "bg-red-100 text-red-800"
                                : "bg-purple-100 text-purple-800"
                            }>
                              {absence.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {absence.startDate === absence.endDate
                              ? `${absence.startDate}`
                              : `${absence.startDate} - ${absence.endDate}`
                            }
                          </div>
                        </li>
                      ))
                    ) : (
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
