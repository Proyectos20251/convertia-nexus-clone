
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type UserRole = "admin" | "manager" | "supervisor" | "collaborator";

type Profile = {
  id: string;
  full_name: string | null;
  position: string | null;
  department: string | null;
  avatar_url: string | null;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  role: UserRole | null;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para desarrollo mientras implementamos Supabase Auth
export const mockUsers = [
  {
    id: "1",
    email: "admin@convertia.com",
    password: "admin123",
    role: "admin" as UserRole,
    profile: {
      id: "1",
      full_name: "Administrador",
      position: "Administrador",
      department: "Dirección",
      avatar_url: null,
    },
  },
  {
    id: "2",
    email: "manager@convertia.com",
    password: "manager123",
    role: "manager" as UserRole,
    profile: {
      id: "2",
      full_name: "Gerente",
      position: "Gerente",
      department: "Recursos Humanos",
      avatar_url: null,
    },
  },
  {
    id: "3",
    email: "user@convertia.com",
    password: "user123",
    role: "collaborator" as UserRole,
    profile: {
      id: "3",
      full_name: "Usuario",
      position: "Colaborador",
      department: "Administración",
      avatar_url: null,
    },
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  // Inicializar la sesión al cargar el componente
  useEffect(() => {
    // Verificar si hay una sesión guardada en localStorage (para mock users)
    const storedUser = localStorage.getItem("convertia-user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.user_metadata?.role || "collaborator");
        
        // Buscar el perfil correspondiente en mockUsers
        const mockUser = mockUsers.find(u => u.email === parsedUser.email);
        if (mockUser) {
          setProfile(mockUser.profile);
        }
        
        setIsLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem("convertia-user");
      }
    }
    
    // Configurar el listener de cambios de autenticación primero
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
          await fetchUserRole(currentSession.user.id);
        } else {
          setProfile(null);
          setRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // Luego verificar la sesión actual
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
        await fetchUserRole(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Obtener el perfil del usuario
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  // Obtener el rol del usuario
  const fetchUserRole = async (userId: string) => {
    try {
      // Primero intentamos con la función de rol de Supabase
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role', { user_id: userId });
        
      if (!roleError && roleData) {
        setRole(roleData as UserRole);
        return;
      }
      
      // Si no hay función o hay error, intentamos obtener el rol de la tabla
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
        
      if (!userRoleError && userRoleData) {
        setRole(userRoleData.role as UserRole);
        return;
      }
      
      // Si no existe, usamos el rol por defecto
      setRole('collaborator');
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setRole('collaborator'); // Rol por defecto en caso de error
    }
  };

  // Función de inicio de sesión con Supabase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Verificar primero si es un usuario mock
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        // Simular inicio de sesión exitoso con usuario mock
        const mockUserData = {
          id: mockUser.id,
          email: mockUser.email,
          user_metadata: { role: mockUser.role }
        };
        localStorage.setItem("convertia-user", JSON.stringify(mockUserData));
        setUser(mockUserData as any);
        setProfile(mockUser.profile);
        setRole(mockUser.role);
        setIsLoading(false);
        return;
      }
      
      // Si no es un usuario mock, intentar con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error.message);
      setIsLoading(false);
      throw error;
    }
  };

  // Función de cierre de sesión 
  const logout = async () => {
    try {
      // Si es un usuario mock, eliminar de localStorage
      if (localStorage.getItem("convertia-user")) {
        localStorage.removeItem("convertia-user");
        setUser(null);
        setProfile(null);
        setRole(null);
        toast.success("Sesión cerrada correctamente");
        return;
      }
      
      // Si no, cerrar sesión en Supabase
      await supabase.auth.signOut();
      toast.success("Sesión cerrada correctamente");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error.message);
      toast.error("Error al cerrar sesión");
    }
  };

  // Función para actualizar el perfil del usuario
  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error("No hay sesión de usuario");
      
      // Si es un usuario mock, actualizar en localStorage
      if (localStorage.getItem("convertia-user")) {
        const mockUserIndex = mockUsers.findIndex(u => u.id === user.id);
        if (mockUserIndex >= 0) {
          mockUsers[mockUserIndex].profile = { 
            ...mockUsers[mockUserIndex].profile, 
            ...data 
          };
          
          // Actualizar el estado local
          setProfile(prev => prev ? { ...prev, ...data } : null);
          
          toast.success("Perfil actualizado correctamente");
          return;
        }
      }
      
      // Si no es un usuario mock, actualizar en Supabase
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Actualizar el estado local
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error.message);
      toast.error("Error al actualizar el perfil");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        role,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
