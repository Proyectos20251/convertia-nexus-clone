
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Bell, 
  User, 
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationCount] = useState(3);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="h-16 bg-white border-b px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="md:pl-[250px] transition-all duration-300 flex items-center">
        <img src="/logo.png" alt="Convert-IA" className="h-8 mr-2" />
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} className="text-gray-600" />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 bg-red-500 text-white h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-teal-100 text-teal-800">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
                <span className="text-xs text-gray-500">{profile?.position || "Usuario"}</span>
              </div>
              <ChevronDown size={16} className="text-gray-500 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
