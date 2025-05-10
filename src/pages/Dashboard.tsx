
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, FileText, Bell, Users } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data
  const announcements = [
    {
      id: 1,
      title: "Nuevo sistema de evaluación",
      date: "2023-05-08",
      description: "A partir del próximo mes implementaremos un nuevo sistema de evaluación de desempeño.",
    },
    {
      id: 2,
      title: "Fiesta de fin de año",
      date: "2023-05-05",
      description: "La fiesta de fin de año se llevará a cabo el 15 de diciembre. ¡No te la pierdas!",
    },
    {
      id: 3,
      title: "Mantenimiento programado",
      date: "2023-05-01",
      description: "El sistema estará en mantenimiento el próximo sábado de 22:00 a 23:00.",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Reunión de equipo",
      date: "2023-05-10",
      time: "10:00 - 11:30",
    },
    {
      id: 2,
      title: "Capacitación: Nuevas tecnologías",
      date: "2023-05-12",
      time: "14:00 - 16:00",
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: "Completar evaluación de rendimiento",
      dueDate: "2023-05-15",
    },
    {
      id: 2,
      title: "Cargar justificante de ausencia",
      dueDate: "2023-05-11",
    },
    {
      id: 3,
      title: "Actualizar información personal",
      dueDate: "2023-05-20",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido, {user?.name}!</h1>
          <p className="text-gray-600">Aquí tienes un resumen de tu actividad reciente</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-convertia-50 border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Clock className="h-6 w-6 mb-2 text-convertia-600" />
              <p className="text-sm font-medium">Registrar jornada</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="h-6 w-6 mb-2 text-blue-600" />
              <p className="text-sm font-medium">Solicitar ausencia</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <FileText className="h-6 w-6 mb-2 text-emerald-600" />
              <p className="text-sm font-medium">Subir documento</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-none">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Users className="h-6 w-6 mb-2 text-amber-600" />
              <p className="text-sm font-medium">Ver organigrama</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks and calendar section */}
          <div className="space-y-6">
            {/* Pending tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Tareas pendientes</CardTitle>
                <CardDescription>Tareas que requieren tu atención</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pendingTasks.map(task => (
                    <li key={task.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500">Fecha límite: {task.dueDate}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Upcoming events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Próximos eventos</CardTitle>
                <CardDescription>Tu calendario para los próximos días</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {upcomingEvents.map(event => (
                    <li key={event.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                      <div className="min-w-[50px] text-center mr-4">
                        <div className="text-xs text-gray-500">{event.date.split('-')[2]}</div>
                        <div className="font-medium">{
                          new Date(event.date).toLocaleString('es-ES', { month: 'short' })
                        }</div>
                      </div>
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Announcements and activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Anuncios recientes</CardTitle>
              <CardDescription>Novedades y comunicados</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {announcements.map(announcement => (
                  <li key={announcement.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <span className="text-xs text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{announcement.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
