
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// Schema de validación del formulario
const loginSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Configurar el formulario con React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Para desarrollo, usuarios de prueba
  const testUsers = [
    { email: "admin@convertia.com", password: "admin123" },
    { email: "manager@convertia.com", password: "manager123" },
    { email: "user@convertia.com", password: "user123" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Convert-IA" className="h-16 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800">Bienvenido a Convert-IA</h1>
            <p className="text-gray-500 mt-2">Plataforma de gestión de recursos humanos</p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder a la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="nombre@empresa.com"
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-0 h-full px-3 py-2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-teal-950 hover:bg-teal-900"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </form>
              </Form>

              {process.env.NODE_ENV === "development" && (
                <div className="mt-6">
                  <Separator className="my-4" />
                  <h4 className="text-sm font-medium text-center mb-2 text-gray-500">
                    Usuarios de prueba (solo en desarrollo)
                  </h4>
                  <div className="grid gap-2">
                    {testUsers.map((user, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-gray-100 p-2 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          form.setValue("email", user.email);
                          form.setValue("password", user.password);
                        }}
                      >
                        <div className="font-semibold">{user.email}</div>
                        <div className="opacity-75">Contraseña: {user.password}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-gray-500">
                ¿Tienes problemas para iniciar sesión?{" "}
                <a href="#" className="text-teal-950 hover:underline">
                  Contacta con soporte
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Imagen lateral */}
      <div className="hidden lg:block lg:w-1/2 bg-teal-950 bg-opacity-90 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 to-teal-900 opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-white">
            <h2 className="text-3xl font-bold mb-6">Gestión de recursos humanos simplificada</h2>
            <p className="text-lg mb-8">Optimiza tus procesos de recursos humanos con nuestra plataforma inteligente y mejora la experiencia de tus colaboradores.</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="rounded-full bg-white bg-opacity-10 p-2 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Gestión del tiempo</h3>
                  <p className="opacity-75 text-sm mt-1">Control de jornada y ausencias centralizado</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full bg-white bg-opacity-10 p-2 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Organización</h3>
                  <p className="opacity-75 text-sm mt-1">Visualiza la estructura de tu empresa</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full bg-white bg-opacity-10 p-2 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Desempeño</h3>
                  <p className="opacity-75 text-sm mt-1">Evaluaciones y seguimiento de objetivos</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full bg-white bg-opacity-10 p-2 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Analítica</h3>
                  <p className="opacity-75 text-sm mt-1">Informes y métricas para toma de decisiones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
