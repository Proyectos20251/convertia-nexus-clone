
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Play, CheckCircle, Award } from 'lucide-react';
import { trainingService, TrainingCourse } from '@/services/trainingService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Training = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TrainingCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await trainingService.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error al cargar los cursos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await trainingService.enrollInCourse(courseId);
      toast.success('Inscrito al curso correctamente');
      fetchCourses();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Error al inscribirse al curso');
    }
  };

  const handleUpdateProgress = async (enrollmentId: string, progress: number) => {
    try {
      await trainingService.updateProgress(enrollmentId, progress);
      toast.success('Progreso actualizado');
      fetchCourses();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Error al actualizar el progreso');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando cursos...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Formación</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay cursos disponibles</p>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => {
              const enrollment = course.enrollments?.[0];
              const isEnrolled = !!enrollment;
              const isCompleted = enrollment?.completed_at;
              const progress = enrollment?.progress || 0;

              return (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <div className="flex flex-col items-end space-y-1">
                        {course.is_mandatory && (
                          <Badge variant="destructive" className="text-xs">Obligatorio</Badge>
                        )}
                        {isCompleted && (
                          <Badge className="bg-green-500 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completado
                          </Badge>
                        )}
                      </div>
                    </div>
                    {course.duration_hours && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration_hours} horas
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col space-y-4">
                    {course.description && (
                      <p className="text-sm text-gray-700 line-clamp-3">{course.description}</p>
                    )}
                    
                    {isEnrolled && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progreso</span>
                          <span className="text-sm text-gray-600">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <div className="mt-auto pt-4">
                      {!isEnrolled ? (
                        <Button 
                          onClick={() => handleEnroll(course.id)}
                          className="w-full"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Inscribirse
                        </Button>
                      ) : isCompleted ? (
                        <Button variant="outline" className="w-full" disabled>
                          <Award className="h-4 w-4 mr-2" />
                          Curso completado
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            onClick={() => window.open(course.content_url || '#', '_blank')}
                            className="w-full"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continuar curso
                          </Button>
                          {enrollment && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateProgress(enrollment.id, Math.min(100, progress + 25))}
                              className="w-full"
                            >
                              Marcar progreso (+25%)
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Training;
