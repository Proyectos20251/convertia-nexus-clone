
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "admin" | "manager" | "supervisor" | "collaborator";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  position: string;
  department: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@convertia.com",
    password: "admin123",
    role: "admin" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=1",
    position: "Director de Tecnología",
    department: "Tecnología",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@convertia.com",
    password: "manager123",
    role: "manager" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=2",
    position: "Gerente de Producto",
    department: "Producto",
  },
  {
    id: "3",
    name: "Colaborador",
    email: "user@convertia.com",
    password: "user123",
    role: "collaborator" as UserRole,
    avatar: "https://i.pravatar.cc/150?img=3",
    position: "Desarrollador Frontend",
    department: "Desarrollo",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("convertia-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("convertia-user", JSON.stringify(userWithoutPassword));
    } else {
      throw new Error("Credenciales inválidas");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("convertia-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
