
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { objectiveService, Objective } from "@/services/objectiveService";
import { toast } from "sonner";

export default function Performance() {
  const { user, isAuthenticated } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data como fallback
  const mockObjectives = [
    {
      id: "1",
      user_id: user?.id || "1",
      creator_id: user?.id || "1",
      title: "Aumentar ventas en un 15%",
      description: "Objetivo de incremento de ventas para el Q2",
      status: "active",
      progress: 60,
      target_date: "2023-12-31",
      created_at: "2023-01-01",
      updated_at: "2023-06-01",
    },
    {
      id: "2",
      user_id: user?.id || "1",
      creator_id: user?.id || "1",
      title: "Completar capacitación en nuevas tecnologías",
      description: "Formación en tecnologías emergentes",
      status: "active",
      progress: 80,
      target_date: "2023-06-30",
      created_at: "2023-01-01",
      updated_at: "2023-05-15",
    },
    {
      id: "3",
      user_id: user?.id || "1",
      creator_id: user?.id || "1",
      title: "Implementar nuevo sistema de gestión",
      description: "Digitalización de procesos",
      status: "active",
      progress: 40,
      target_date: "2023-09-15",
      created_at: "2023-01-01",
      updated_at: "2023-04-20",
    },
    {
      id: "4",
      user_id: user?.id || "1",
      creator_id: user?.id || "1",
      title: "Reducir tiempo de respuesta al cliente",
      description: "Mejora en atención al cliente",
      status: "completed",
      progress: 100,
      target_date: "2023-04-30",
      created_at: "2023-01-01",
      updated_at: "2023-04-30",
    },
  ];

  const feedbackHistory = [
    {
      id: 1,
      date: "2023-04-15",
      type: "Revisión trimestral",
      rating: 4.5,
      strengths: ["Comunicación", "Trabajo en equipo", "Resolución de problemas"],
      improvements: ["Gestión del tiempo", "Delegación de tareas"],
      comments: "Excelente desempeño este trimestre. Ha superado las expectativas en varios proyectos clave.",
    },
    {
      id: 2,
      date: "2023-01-20",
      type: "Revisión trimestral",
      rating: 4.2,
      strengths: ["Conocimientos técnicos", "Calidad del trabajo"],
      improvements: ["Comunicación con otros equipos", "Documentación"],
      comments: "Buen trabajo. Necesita mejorar la comunicación con otros departamentos.",
    },
    {
      id: 3,
      date: "2022-10-05",
      type: "Revisión trimestral",
      rating: 4.0,
      strengths: ["Puntualidad", "Compromiso"],
      improvements: ["Habilidades de presentación", "Iniciativa"],
      comments: "Desempeño consistente. Recomendaría tomar más iniciativa en proyectos futuros.",
    },
  ];

  const upcomingEvaluations = [
    {
      id: 1,
      title: "Revisión trimestral Q2",
      date: "2023-06-15",
      evaluator: "Carlos López",
      status: "Programada",
    },
  ];

  useEffect(() => {
    const fetchObjectives = async () => {
      if (!isAuthenticated || !user?.id) {
        console.log("Usuario no autenticado, usando datos mock");
        setObjectives(mockObjectives);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await objectiveService.getUserObjectives(user.id);
        
        if (data.length === 0) {
          console.log("No hay objetivos en la base de datos, usando datos mock");
          setObjectives(mockObjectives);
        } else {
          setObjectives(data);
        }
      } catch (error) {
        console.error("Error fetching objectives:", error);
        toast.error("Error al cargar objetivos, mostrando datos de ejemplo");
        setObjectives(mockObjectives);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectives();
  }, [user?.id, isAuthenticated]);

  // Calcular estadísticas
  const completedObjectives = objectives.filter(obj => obj.status === 'completed' || obj.progress === 100);
  const activeObjectives = objectives.filter(obj => obj.status === 'active' && obj.progress < 100);
  const overdueObjectives = objectives.filter(obj => {
    if (!obj.target_date) return false;
    const targetDate = new Date(obj.target_date);
    const today = new Date();
    return targetDate < today && obj.status !== 'completed' && obj.progress < 100;
  });

  const averageProgress = objectives.length > 0 
    ? Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length)
    : 0;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Desempeño</h1>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-teal-950 animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos de desempeño...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Desempeño</h1>
        
        <Tabs defaultValue="objectives" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
            <TabsTrigger value="evaluations">Evaluaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="objectives">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resumen */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Resumen de objetivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-2">Progreso general</div>
                      <div className="flex items-end mb-2">
                        <span className="text-3xl font-bold text-gray-800 mr-2">{averageProgress}%</span>
                      </div>
                      <Progress value={averageProgress} className="h-2 bg-gray-200" />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Estado de objetivos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <div className="text-lg font-bold text-green-600">{completedObjectives.length}</div>
                          <div className="text-xs text-gray-500">Completados</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <div className="text-lg font-bold text-amber-600">{activeObjectives.length}</div>
                          <div className="text-xs text-gray-500">En progreso</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <div className="text-lg font-bold text-red-600">{overdueObjectives.length}</div>
                          <div className="text-xs text-gray-500">Retrasados</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md text-center">
                          <div className="text-lg font-bold">{objectives.length}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de objetivos */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Mis objetivos</CardTitle>
                  <CardDescription>
                    Seguimiento de tus objetivos actuales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {objectives.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No tienes objetivos asignados
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {objectives.map((objective) => (
                        <li key={objective.id} className="border p-4 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{objective.title}</h4>
                              <div className="text-sm text-gray-500 mt-1">
                                Fecha límite: {objective.target_date ? new Date(objective.target_date).toLocaleDateString() : 'Sin fecha'}
                              </div>
                            </div>
                            <Badge className={
                              objective.progress === 100 || objective.status === 'completed'
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }>
                              {objective.progress === 100 || objective.status === 'completed' ? 'Completado' : 'En progreso'}
                            </Badge>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progreso</span>
                              <span className="font-medium">{objective.progress}%</span>
                            </div>
                            <Progress 
                              value={objective.progress}
                              className="h-2 bg-gray-200"
                            />
                          </div>
                          
                          <div className="flex justify-between mt-3 text-sm">
                            <Badge variant="outline">Objetivo</Badge>
                            <button className="text-convertia-600 hover:underline">
                              Ver detalles
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evaluations">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Próximas evaluaciones */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Próximas evaluaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvaluations.length > 0 ? (
                    <ul className="space-y-4">
                      {upcomingEvaluations.map((evaluation) => (
                        <li key={evaluation.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="font-medium">{evaluation.title}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {evaluation.date}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Evaluador: {evaluation.evaluator}
                          </div>
                          <Badge className="mt-2 bg-blue-100 text-blue-800">
                            {evaluation.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No tienes evaluaciones programadas
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Historial de feedback */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Historial de evaluaciones</CardTitle>
                  <CardDescription>
                    Feedback recibido en evaluaciones anteriores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-6">
                    {feedbackHistory.map((feedback) => (
                      <li key={feedback.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{feedback.type}</h4>
                            <div className="text-sm text-gray-500">
                              {feedback.date}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-amber-500 text-lg font-bold mr-1">
                              {feedback.rating}
                            </div>
                            <div className="text-sm text-gray-500">/5</div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Fortalezas</h5>
                          <div className="flex flex-wrap gap-2">
                            {feedback.strengths.map((strength, index) => (
                              <Badge key={index} variant="outline" className="bg-green-50">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Áreas de mejora</h5>
                          <div className="flex flex-wrap gap-2">
                            {feedback.improvements.map((improvement, index) => (
                              <Badge key={index} variant="outline" className="bg-amber-50">
                                {improvement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-1">Comentarios</h5>
                          <p className="text-sm text-gray-600">
                            {feedback.comments}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
