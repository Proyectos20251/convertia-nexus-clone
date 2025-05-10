
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

// Mock users solo para desarrollo mientras implementamos Supabase Auth
const mockUsers = [
  {
    id: "1",
    email: "admin@convertia.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    email: "manager@convertia.com",
    password: "manager123",
    role: "manager" as UserRole,
  },
  {
    id: "3",
    email: "user@convertia.com",
    password: "user123",
    role: "collaborator" as UserRole,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // No necesitamos establecer manualmente user, session, profile o role aquí
      // El listener onAuthStateChange se encargará de eso
      
      toast.success("Inicio de sesión exitoso");
    } catch (error: any) {
      // Verificar si estamos en modo desarrollo y usar usuarios mock
      if (process.env.NODE_ENV === 'development') {
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
          setRole(mockUser.role);
          setIsLoading(false);
          return;
        }
      }
      
      console.error("Error de inicio de sesión:", error.message);
      toast.error(error.message || "Error al iniciar sesión");
      setIsLoading(false);
      throw error;
    }
  };

  // Función de cierre de sesión con Supabase
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // No necesitamos establecer estados manualmente
      // El listener onAuthStateChange se encargará de eso
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
