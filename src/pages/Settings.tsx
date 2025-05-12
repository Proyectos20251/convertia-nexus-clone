
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { role } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            {role && ['admin', 'manager'].includes(role) && (
              <TabsTrigger value="admin">Administración</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Información de la cuenta</CardTitle>
                  <CardDescription>
                    Administra tu información personal y de contacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" placeholder="Tu nombre completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="tu@ejemplo.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="+34 600 000 000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Puesto</Label>
                      <Input id="position" placeholder="Tu cargo o posición" />
                    </div>
                  </div>
                  <Button>Guardar cambios</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Preferencias</CardTitle>
                  <CardDescription>
                    Personaliza tu experiencia en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Idioma</p>
                      <p className="text-sm text-gray-500">Selecciona el idioma para la interfaz</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Español</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Tema oscuro</p>
                      <p className="text-sm text-gray-500">Activa el modo oscuro para la interfaz</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Zona horaria</p>
                      <p className="text-sm text-gray-500">Define tu zona horaria para eventos y notificaciones</p>
                    </div>
                    <div>
                      <Badge>Europe/Madrid (GMT+2)</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-red-600">Zona peligrosa</CardTitle>
                  <CardDescription>
                    Acciones irreversibles para tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Eliminar cuenta</p>
                      <p className="text-sm text-gray-500">Esta acción es permanente y no se puede deshacer</p>
                    </div>
                    <Button variant="destructive" size="sm">Eliminar cuenta</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Preferencias de notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Correo electrónico</p>
                    <p className="text-sm text-gray-500">Recibe notificaciones por correo electrónico</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Notificaciones en la plataforma</p>
                    <p className="text-sm text-gray-500">Notificaciones en tiempo real dentro de la aplicación</p>
                  </div>
                  <Switch id="app-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Calendario</p>
                    <p className="text-sm text-gray-500">Notificaciones sobre eventos próximos</p>
                  </div>
                  <Switch id="calendar-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">Recordatorios de tareas</p>
                    <p className="text-sm text-gray-500">Alertas sobre plazos y tareas pendientes</p>
                  </div>
                  <Switch id="task-notifications" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {role && ['admin', 'manager'].includes(role) && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Configuración de administrador</CardTitle>
                  <CardDescription>
                    Controla los ajustes generales de la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Nuevos registros</p>
                      <p className="text-sm text-gray-500">Permitir que nuevos usuarios se registren</p>
                    </div>
                    <Switch id="allow-registrations" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Modo mantenimiento</p>
                      <p className="text-sm text-gray-500">Activa el modo de mantenimiento en la plataforma</p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Registro de actividad</p>
                      <p className="text-sm text-gray-500">Habilitar registro detallado de actividad de usuarios</p>
                    </div>
                    <Switch id="activity-log" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}
