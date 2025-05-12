
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar,
  BarChart2,
  Clock,
  FileText,
  Home,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Users,
  X,
  HelpCircle
} from "lucide-react";

// Definición de los elementos de navegación
const navItems = [
  {
    title: "Inicio",
    path: "/dashboard",
    icon: Home,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Organización",
    path: "/organization",
    icon: Users,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Gestión del Tiempo",
    path: "/time-management",
    icon: Clock,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Evaluación de Desempeño",
    path: "/performance",
    icon: BarChart2,
    roles: ["admin", "manager", "supervisor"],
  },
  {
    title: "Comunicación",
    path: "/inbox",
    icon: MessageSquare,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Documentación",
    path: "/documents",
    icon: FileText,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Calendario",
    path: "/calendar",
    icon: Calendar,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Ayuda",
    path: "/help",
    icon: HelpCircle,
    roles: ["admin", "manager", "supervisor", "collaborator"],
  },
  {
    title: "Configuración",
    path: "/settings",
    icon: Settings,
    roles: ["admin", "manager"],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, role } = useAuth();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    item => role && item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="block md:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileSidebar}
          className="bg-white shadow-md rounded-full"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r z-40 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <div className="font-bold text-teal-950 text-xl">Convert-IA</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
          >
            <Menu size={18} />
          </Button>
        </div>

        {/* Search - Only visible when expanded */}
        {!isCollapsed && (
          <div className="px-3 py-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-8 py-2 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-teal-50 text-teal-700"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <item.icon 
                      size={20} 
                      className={cn(
                        isActive ? "text-teal-600" : "text-gray-500",
                        isCollapsed ? "mx-auto" : "mr-3"
                      )} 
                    />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
