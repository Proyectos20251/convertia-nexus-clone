
import { useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-teal-950 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Usuarios de prueba
  const testUsers = [
    { email: "admin@convertia.com", password: "admin123", role: "Administrador" },
    { email: "manager@convertia.com", password: "manager123", role: "Gerente" },
    { email: "user@convertia.com", password: "user123", role: "Usuario" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full text-center mb-8">
        <img src="/logo.png" alt="Convert-IA" className="h-16 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800">Convert-IA</h1>
        <p className="text-gray-500 mt-2">Plataforma de gestión de recursos humanos</p>
      </div>
      
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido a la demo</CardTitle>
            <CardDescription>
              Utiliza alguno de los siguientes usuarios para iniciar sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {testUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="text-sm bg-gray-50 p-3 rounded border border-gray-200"
                >
                  <div className="font-medium text-teal-950">{user.role}</div>
                  <div className="text-gray-600">Usuario: {user.email}</div>
                  <div className="text-gray-600">Contraseña: {user.password}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              className="w-full bg-teal-950 hover:bg-teal-900"
              asChild
            >
              <Link to="/login">Ir a iniciar sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
