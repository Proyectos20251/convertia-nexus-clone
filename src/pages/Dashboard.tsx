
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart2, Calendar, Clock, FileText, MessageSquare, Settings, Users, 
  Target, BookOpen, ClipboardList, Heart, Bot, TrendingUp, Award,
  Building, UserCheck, Search, HelpCircle, DollarSign, Shield,
  Briefcase, PieChart, FileSpreadsheet
} from "lucide-react";
import { Link } from "react-router-dom";

// Definición completa de todos los módulos de RRHH
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
    title: "Bandeja de entrada",
    description: "Mensajes y comunicación interna",
    icon: MessageSquare,
    color: "bg-green-500",
    link: "/inbox",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Búsqueda Global",
    description: "Buscar empleados, documentos y recursos",
    icon: Search,
    color: "bg-purple-500",
    link: "/search",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Organigrama",
    description: "Estructura organizacional visual",
    icon: Building,
    color: "bg-indigo-500",
    link: "/organization",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Expedientes",
    description: "Perfiles completos de empleados",
    icon: UserCheck,
    color: "bg-teal-500",
    link: "/organization",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Control de jornada",
    description: "Registro de horarios y asistencia",
    icon: Clock,
    color: "bg-orange-500",
    link: "/time-management",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Ausencias",
    description: "Gestión de vacaciones y permisos",
    icon: Calendar,
    color: "bg-red-500",
    link: "/time-management",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Calendario",
    description: "Eventos, reuniones y fechas importantes",
    icon: Calendar,
    color: "bg-blue-600",
    link: "/calendar",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Evaluaciones",
    description: "Revisiones de rendimiento y objetivos",
    icon: BarChart2,
    color: "bg-purple-600",
    link: "/performance",
    roles: ["admin", "manager", "supervisor"]
  },
  {
    title: "Objetivos",
    description: "Definición y seguimiento de metas",
    icon: Target,
    color: "bg-emerald-500",
    link: "/objectives",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Formación",
    description: "Cursos y desarrollo profesional",
    icon: BookOpen,
    color: "bg-amber-500",
    link: "/training",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Competencias",
    description: "Evaluación de habilidades y competencias",
    icon: Award,
    color: "bg-pink-500",
    link: "/competencies",
    roles: ["admin", "manager", "supervisor"]
  },
  {
    title: "Nómina",
    description: "Gestión de salarios y pagos",
    icon: DollarSign,
    color: "bg-green-600",
    link: "/payroll",
    roles: ["admin", "manager"]
  },
  {
    title: "Beneficios",
    description: "Beneficios y ventajas corporativas",
    icon: Heart,
    color: "bg-rose-500",
    link: "/benefits",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Compensación",
    description: "Compensaciones adicionales y bonos",
    icon: TrendingUp,
    color: "bg-cyan-500",
    link: "/compensation",
    roles: ["admin", "manager"]
  },
  {
    title: "Documentos",
    description: "Archivos y documentos importantes",
    icon: FileText,
    color: "bg-slate-500",
    link: "/documents",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Firma Digital",
    description: "Documentos para firma electrónica",
    icon: FileText,
    color: "bg-violet-500",
    link: "/digital-signature",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Cumplimiento",
    description: "Documentos de cumplimiento legal",
    icon: Shield,
    color: "bg-red-600",
    link: "/compliance",
    roles: ["admin", "manager"]
  },
  {
    title: "Clima Laboral",
    description: "Evaluación del ambiente de trabajo",
    icon: Heart,
    color: "bg-lime-500",
    link: "/climate",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Encuestas",
    description: "Encuestas y feedback de empleados",
    icon: ClipboardList,
    color: "bg-sky-500",
    link: "/surveys",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Bienestar",
    description: "Recursos de salud y bienestar",
    icon: Heart,
    color: "bg-emerald-600",
    link: "/wellness",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "People Analytics",
    description: "Análisis y métricas de recursos humanos",
    icon: PieChart,
    color: "bg-indigo-600",
    link: "/analytics",
    roles: ["admin", "manager"]
  },
  {
    title: "Reportes",
    description: "Generación de reportes y estadísticas",
    icon: FileSpreadsheet,
    color: "bg-orange-600",
    link: "/reports",
    roles: ["admin", "manager"]
  },
  {
    title: "Asistente IA",
    description: "Asistente inteligente para RRHH",
    icon: Bot,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    link: "/ai-assistant",
    roles: ["admin", "manager", "supervisor", "collaborator"]
  },
  {
    title: "Integraciones",
    description: "Conexiones con herramientas externas",
    icon: Briefcase,
    color: "bg-gray-600",
    link: "/integrations",
    roles: ["admin", "manager"]
  },
  {
    title: "Configuración",
    description: "Ajustes de la aplicación y del perfil",
    icon: Settings,
    color: "bg-gray-500",
    link: "/settings",
    roles: ["admin", "manager"]
  },
  {
    title: "Ayuda",
    description: "Centro de ayuda y soporte",
    icon: HelpCircle,
    color: "bg-blue-700",
    link: "/help",
    roles: ["admin", "manager", "supervisor", "collaborator"]
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
      <div className="max-w-7xl mx-auto relative">
        {/* Background decorative elements for 3D futuristic effect */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="mb-8 transform transition-all hover:translate-y-[-5px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl blur-xl -z-10"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bienvenido, {profile?.full_name || "Usuario"}
            </h1>
            <p className="text-gray-600">
              Panel de control de Recursos Humanos | {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Usuario"}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module, index) => (
            <Link 
              key={index} 
              to={module.link} 
              className="transition-all hover:scale-105 hover:translate-y-[-5px] focus:outline-none focus:ring-2 focus:ring-teal-950 focus:ring-opacity-50 rounded-lg"
            >
              <Card className="h-full relative overflow-hidden border-0">
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm z-0 border border-white/30 rounded-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]"></div>
                
                {/* 3D effect elements */}
                <div className={`absolute top-0 left-0 w-full h-1 ${module.color} opacity-70 rounded-t-lg`}></div>
                <div className={`absolute bottom-0 right-0 w-1/3 h-1 ${module.color} opacity-50`}></div>
                <div className={`absolute top-1/2 right-4 w-20 h-20 ${module.color} opacity-10 rounded-full blur-xl -z-0`}></div>
                
                <CardHeader className="relative z-10 pb-2">
                  <div className={`w-12 h-12 rounded-lg ${module.color} text-white flex items-center justify-center mb-3 shadow-lg transform transition-transform hover:rotate-12`}>
                    <module.icon size={24} />
                  </div>
                  <CardTitle className="text-gray-800 text-sm font-semibold">{module.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <CardDescription className="text-xs">{module.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
