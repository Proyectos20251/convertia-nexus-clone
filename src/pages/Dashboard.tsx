
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, Clock, FileText, MessageSquare, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Definición de los módulos que se mostrarán en el dashboard
const modules = [
  {
    title: "Organización",
    description: "Gestión de departamentos y estructura organizacional",
    icon: Users,
    color: "bg-blue-500",
    link: "/organization",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Gestión del Tiempo",
    description: "Control de horarios, ausencias y vacaciones",
    icon: Clock,
    color: "bg-green-500",
    link: "/time-management",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Evaluación de Desempeño",
    description: "Revisiones de rendimiento y objetivos",
    icon: BarChart2,
    color: "bg-purple-500",
    link: "/performance",
    roles: ["admin", "manager", "supervisor"]
  },
  {
    title: "Comunicación",
    description: "Mensajes y notificaciones internas",
    icon: MessageSquare,
    color: "bg-yellow-500", 
    link: "/inbox",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Documentación",
    description: "Archivos y documentos importantes",
    icon: FileText,
    color: "bg-red-500",
    link: "/documents",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Calendario",
    description: "Eventos, reuniones y fechas importantes",
    icon: Calendar,
    color: "bg-indigo-500",
    link: "/calendar",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Configuración",
    description: "Ajustes de la aplicación y del perfil",
    icon: Settings,
    color: "bg-gray-500",
    link: "/settings",
    roles: ["admin", "manager"]
  }
];

export default function Dashboard() {
  const { profile, role } = useAuth();
  
  // Filtramos los módulos según el rol del usuario
  const filteredModules = modules.filter(module => 
    role && module.roles.includes(role)
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {profile?.full_name || "Usuario"}
          </h1>
          <p className="text-gray-600">
            Panel de control | {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Usuario"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => (
            <Link 
              key={index} 
              to={module.link} 
              className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-950 focus:ring-opacity-50 rounded-lg"
            >
              <Card className="h-full bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${module.color} text-white flex items-center justify-center mb-3`}>
                    <module.icon size={24} />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Accede para gestionar {module.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
