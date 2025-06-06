
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Plus, Search, Star, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
}

interface CompetencyEvaluation {
  id: string;
  user_id: string;
  competency_id: string;
  evaluator_id: string;
  score: number;
  comments: string;
  evaluation_period: string;
  created_at: string;
}

const Competencies = () => {
  const { user, role } = useAuth();
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [evaluations, setEvaluations] = useState<CompetencyEvaluation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [newCompetency, setNewCompetency] = useState({
    name: '',
    description: '',
    category: 'technical'
  });

  useEffect(() => {
    fetchCompetencies();
    fetchEvaluations();
  }, []);

  const fetchCompetencies = async () => {
    try {
      const { data, error } = await supabase
        .from('competencies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompetencies(data || []);
    } catch (error) {
      console.error('Error fetching competencies:', error);
      toast.error('Error al cargar las competencias');
    }
  };

  const fetchEvaluations = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('competency_evaluations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvaluations(data || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCompetency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('competencies')
        .insert({
          name: newCompetency.name,
          description: newCompetency.description,
          category: newCompetency.category
        });

      if (error) throw error;

      toast.success('Competencia creada exitosamente');
      setIsCreateDialogOpen(false);
      setNewCompetency({ name: '', description: '', category: 'technical' });
      fetchCompetencies();
    } catch (error) {
      console.error('Error creating competency:', error);
      toast.error('Error al crear la competencia');
    }
  };

  const getScoreForCompetency = (competencyId: string) => {
    const evaluation = evaluations.find(e => e.competency_id === competencyId);
    return evaluation?.score || 0;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'leadership': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-green-100 text-green-800';
      case 'analytical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCompetencies = competencies.filter(competency => {
    const matchesSearch = competency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         competency.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || competency.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const canCreateCompetencies = role === 'admin' || role === 'manager';

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando competencias...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Competencias</h1>
          {canCreateCompetencies && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Competencia
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nueva Competencia</DialogTitle>
                </DialogHeader>
                <form onSubmit={createCompetency} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                      id="name"
                      value={newCompetency.name}
                      onChange={(e) => setNewCompetency(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newCompetency.description}
                      onChange={(e) => setNewCompetency(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={newCompetency.category} onValueChange={(value) => setNewCompetency(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Técnica</SelectItem>
                        <SelectItem value="leadership">Liderazgo</SelectItem>
                        <SelectItem value="communication">Comunicación</SelectItem>
                        <SelectItem value="analytical">Analítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Competencia</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar competencias..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="technical">Técnica</SelectItem>
              <SelectItem value="leadership">Liderazgo</SelectItem>
              <SelectItem value="communication">Comunicación</SelectItem>
              <SelectItem value="analytical">Analítica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCompetencies.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron competencias</p>
              </CardContent>
            </Card>
          ) : (
            filteredCompetencies.map((competency) => {
              const userScore = getScoreForCompetency(competency.id);
              return (
                <Card key={competency.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{competency.name}</CardTitle>
                      <Badge className={getCategoryColor(competency.category)}>
                        {competency.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {competency.description && (
                      <p className="text-sm text-gray-600">{competency.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tu puntuación:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${star <= userScore ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({userScore}/5)</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Target className="h-4 w-4 mr-2" />
                      Ver Evaluaciones
                    </Button>
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

export default Competencies;
