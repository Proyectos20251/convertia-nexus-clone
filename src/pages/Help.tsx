
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function Help() {
  const { toast } = useToast();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  
  // Mock data
  const faqs = [
    {
      question: "¿Cómo puedo solicitar vacaciones?",
      answer: "Para solicitar vacaciones, dirígete al módulo de 'Gestión del Tiempo', selecciona la pestaña 'Ausencias' y haz clic en el botón 'Solicitar ausencia'. Completa el formulario con las fechas deseadas y el motivo, y envía la solicitud para su aprobación."
    },
    {
      question: "¿Cómo cambio mi contraseña?",
      answer: "Para cambiar tu contraseña, haz clic en tu perfil en la parte superior derecha, selecciona 'Configuración' y luego la pestaña 'Seguridad'. Allí encontrarás la opción para cambiar tu contraseña."
    },
    {
      question: "¿Cómo puedo ver mi recibo de nómina?",
      answer: "Para ver tu recibo de nómina, ve a tu perfil de usuario, selecciona la pestaña 'Documentos' y allí encontrarás todos tus recibos de nómina disponibles para descargar."
    },
    {
      question: "¿Cómo registro horas extras?",
      answer: "Para registrar horas extras, ve al módulo 'Gestión del Tiempo', pestaña 'Registro de Jornada', y haz clic en 'Registrar horas extras'. Completa el formulario indicando la fecha, las horas y el motivo."
    },
    {
      question: "¿Cómo puedo ver el organigrama de la empresa?",
      answer: "Para ver el organigrama de la empresa, ve al módulo 'Organización' y selecciona la pestaña 'Organigrama'. Allí podrás visualizar la estructura jerárquica completa de la empresa."
    },
  ];
  
  const updates = [
    {
      id: 1,
      title: "Nueva función de gestión de ausencias",
      date: "2023-05-02",
      description: "Hemos añadido nuevas características para mejorar la gestión de ausencias y solicitudes de tiempo libre.",
    },
    {
      id: 2,
      title: "Mejora en el rendimiento general",
      date: "2023-04-20",
      description: "Hemos optimizado el rendimiento de la plataforma para proporcionar una experiencia más fluida.",
    },
    {
      id: 3,
      title: "Nueva integración con calendario",
      date: "2023-04-15",
      description: "Ahora puedes sincronizar tus ausencias y eventos importantes con tu calendario personal.",
    },
  ];
  
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: "Mensaje enviado",
      description: "Hemos recibido tu mensaje. Un agente te responderá en breve.",
      className: "bg-green-50 text-green-900 border-green-200",
    });
    
    setChatMessage("");
    setIsChatOpen(false);
  };
  
  const handleSendFeedback = () => {
    if (!feedbackMessage.trim()) return;
    
    toast({
      title: "Gracias por tu opinión",
      description: "Tu feedback ha sido enviado correctamente.",
      className: "bg-green-50 text-green-900 border-green-200",
    });
    
    setFeedbackMessage("");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ayuda y comentarios</h1>
        
        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="help">Obtener ayuda</TabsTrigger>
            <TabsTrigger value="feedback">Compartir opinión</TabsTrigger>
            <TabsTrigger value="updates">Novedades</TabsTrigger>
          </TabsList>
          
          {/* Obtener ayuda tab */}
          <TabsContent value="help">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Soporte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full flex items-center justify-center"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Iniciar chat de ayuda
                  </Button>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Horario de soporte</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Lunes a viernes: 9:00 - 18:00
                    </p>
                    <p className="text-sm text-gray-600">
                      Tiempo de respuesta promedio: &lt;1 hora
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Contacto alternativo</h3>
                    <p className="text-sm text-gray-600">
                      Email: soporte@convertia.com
                    </p>
                    <p className="text-sm text-gray-600">
                      Teléfono: +34 911 234 567
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Preguntas frecuentes</CardTitle>
                  <CardDescription>
                    Respuestas a las preguntas más comunes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-medium mb-2">{faq.question}</h3>
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Compartir opinión tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Enviar comentarios</CardTitle>
                <CardDescription>
                  Ayúdanos a mejorar compartiendo tu experiencia o sugerencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="feedback-type" className="block text-sm font-medium">
                      Tipo de comentario
                    </label>
                    <select 
                      id="feedback-type"
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="suggestion">Sugerencia</option>
                      <option value="issue">Problema</option>
                      <option value="appreciation">Agradecimiento</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="feedback-module" className="block text-sm font-medium">
                      Módulo relacionado
                    </label>
                    <select 
                      id="feedback-module"
                      className="w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="general">General</option>
                      <option value="dashboard">Inicio</option>
                      <option value="time">Gestión del tiempo</option>
                      <option value="organization">Organización</option>
                      <option value="performance">Desempeño</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="feedback-message" className="block text-sm font-medium">
                      Tu mensaje
                    </label>
                    <Textarea 
                      id="feedback-message"
                      placeholder="Describe tu experiencia o sugerencia..."
                      className="min-h-[150px]"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="feedback-screenshot" className="block text-sm font-medium">
                      Adjuntar captura de pantalla (opcional)
                    </label>
                    <Input 
                      id="feedback-screenshot"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      className="bg-convertia-600 hover:bg-convertia-700"
                      onClick={handleSendFeedback}
                      disabled={!feedbackMessage.trim()}
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Enviar comentarios
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Novedades tab */}
          <TabsContent value="updates">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Últimas actualizaciones</CardTitle>
                <CardDescription>
                  Novedades y mejoras recientes en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-6">
                  {updates.map((update) => (
                    <li key={update.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-4">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <h3 className="font-medium">{update.title}</h3>
                            <span className="text-sm text-gray-500">{update.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {update.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Chat dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chat de soporte</DialogTitle>
            <DialogDescription>
              Explica tu problema y un agente te ayudará en breve
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="https://i.pravatar.cc/150?img=25" />
                <AvatarFallback>CS</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">Soporte Convert-IA</div>
                <div className="text-xs text-green-600">En línea</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg text-sm">
              Hola, ¿cómo puedo ayudarte hoy?
            </div>
          </div>
          
          <Textarea
            placeholder="Escribe tu mensaje aquí..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleSendChatMessage}
              disabled={!chatMessage.trim()}
            >
              Enviar mensaje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
