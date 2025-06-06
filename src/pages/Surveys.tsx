
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileQuestion, Send, CheckCircle } from 'lucide-react';
import { surveyService, Survey } from '@/services/surveyService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Surveys = () => {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const data = await surveyService.getActiveSurveys();
      setSurveys(data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast.error('Error al cargar las encuestas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurvey) return;

    try {
      await surveyService.submitResponse(selectedSurvey.id, responses);
      toast.success('Respuesta enviada correctamente');
      setSelectedSurvey(null);
      setResponses({});
      fetchSurveys();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Error al enviar la respuesta');
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const renderQuestion = (question: any, index: number) => {
    const questionId = `question_${index}`;
    
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div key={index} className="space-y-3">
            <Label className="text-base font-medium">{question.text}</Label>
            <RadioGroup 
              value={responses[questionId] || ''} 
              onValueChange={(value) => handleResponseChange(questionId, value)}
            >
              {question.options?.map((option: string, optIndex: number) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${questionId}_${optIndex}`} />
                  <Label htmlFor={`${questionId}_${optIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case 'text':
        return (
          <div key={index} className="space-y-3">
            <Label className="text-base font-medium">{question.text}</Label>
            <Textarea
              value={responses[questionId] || ''}
              onChange={(e) => handleResponseChange(questionId, e.target.value)}
              placeholder="Tu respuesta..."
              rows={3}
            />
          </div>
        );
        
      case 'rating':
        return (
          <div key={index} className="space-y-3">
            <Label className="text-base font-medium">{question.text}</Label>
            <RadioGroup 
              value={responses[questionId] || ''} 
              onValueChange={(value) => handleResponseChange(questionId, value)}
              className="flex space-x-4"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`${questionId}_${rating}`} />
                  <Label htmlFor={`${questionId}_${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando encuestas...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Encuestas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {surveys.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay encuestas disponibles</p>
              </CardContent>
            </Card>
          ) : (
            surveys.map((survey) => {
              const hasResponse = survey.responses && survey.responses.length > 0;
              const isExpired = survey.expires_at && new Date(survey.expires_at) < new Date();

              return (
                <Card key={survey.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{survey.title}</CardTitle>
                      <div className="flex flex-col items-end space-y-1">
                        {hasResponse && (
                          <Badge className="bg-green-500 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completada
                          </Badge>
                        )}
                        {isExpired && (
                          <Badge variant="destructive" className="text-xs">Expirada</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Creada: {new Date(survey.created_at).toLocaleDateString()}
                    </p>
                    {survey.expires_at && (
                      <p className="text-sm text-gray-600">
                        Expira: {new Date(survey.expires_at).toLocaleDateString()}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {survey.description && (
                      <p className="text-sm text-gray-700 line-clamp-3">{survey.description}</p>
                    )}

                    <Dialog open={selectedSurvey?.id === survey.id} onOpenChange={(open) => {
                      if (!open) {
                        setSelectedSurvey(null);
                        setResponses({});
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => setSelectedSurvey(survey)}
                          className="w-full"
                          disabled={hasResponse || isExpired}
                        >
                          {hasResponse ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Ya completada
                            </>
                          ) : isExpired ? (
                            'Encuesta expirada'
                          ) : (
                            <>
                              <FileQuestion className="h-4 w-4 mr-2" />
                              Responder encuesta
                            </>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{survey.title}</DialogTitle>
                          {survey.description && (
                            <p className="text-sm text-gray-600">{survey.description}</p>
                          )}
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmitResponse} className="space-y-6">
                          {survey.questions && Array.isArray(survey.questions) && 
                            survey.questions.map((question, index) => renderQuestion(question, index))
                          }
                          
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedSurvey(null);
                                setResponses({});
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button type="submit">
                              <Send className="h-4 w-4 mr-2" />
                              Enviar respuesta
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
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

export default Surveys;
