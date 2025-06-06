
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Calendar, TrendingUp } from 'lucide-react';
import { objectiveService, Objective } from '@/services/objectiveService';
import { employeeService, Employee } from '@/services/employeeService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Objectives = () => {
  const { user, role } = useAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newObjective, setNewObjective] = useState({
    user_id: '',
    title: '',
    description: '',
    target_date: ''
  });

  const isManager = role === 'admin' || role === 'manager';

  useEffect(() => {
    if (user) {
      fetchObjectives();
      if (isManager) {
        fetchEmployees();
      }
    }
  }, [user, isManager]);

  const fetchObjectives = async () => {
    try {
      if (!user) return;
      const data = await objectiveService.getUserObjectives(user.id);
      setObjectives(data);
    } catch (error) {
      console.error('Error fetching objectives:', error);
      toast.error('Error al cargar los objetivos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreateObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const objectiveData = {
        ...newObjective,
        user_id: isManager ? newObjective.user_id : user?.id || ''
      };
      
      await objectiveService.createObjective(objectiveData);
      toast.success('Objetivo creado correctamente');
      setDialogOpen(false);
      setNewObjective({ user_id: '', title: '', description: '', target_date: '' });
      fetchObjectives();
    } catch (error) {
      console.error('Error creating objective:', error);
      toast.error('Error al crear el objetivo');
    }
  };

  const handleUpdateProgress = async (objectiveId: string, progress: number) => {
    try {
      await objectiveService.updateProgress(objectiveId, progress);
      toast.success('Progreso actualizado');
      fetchObjectives();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Error al actualizar el progreso');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando objetivos...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Objetivos</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo objetivo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear nuevo objetivo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateObjective} className="space-y-4">
                {isManager && (
                  <div>
                    <Label htmlFor="user">Asignar a</Label>
                    <Select value={newObjective.user_id} onValueChange={(value) => setNewObjective({...newObjective, user_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.first_name} {emp.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newObjective.title}
                    onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newObjective.description}
                    onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="target_date">Fecha objetivo</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={newObjective.target_date}
                    onChange={(e) => setNewObjective({...newObjective, target_date: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear objetivo</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {objectives.length === 0 ? (
            <Card className="col-span-2">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No tienes objetivos asignados</p>
              </CardContent>
            </Card>
          ) : (
            objectives.map((objective) => (
              <Card key={objective.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{objective.title}</CardTitle>
                    <Badge className={getStatusColor(objective.status)}>
                      {objective.status === 'completed' ? 'Completado' : 'Activo'}
                    </Badge>
                  </div>
                  {objective.target_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Meta: {new Date(objective.target_date).toLocaleDateString()}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {objective.description && (
                    <p className="text-sm text-gray-700">{objective.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progreso</span>
                      <span className="text-sm text-gray-600">{objective.progress}%</span>
                    </div>
                    <Progress value={objective.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateProgress(objective.id, Math.min(100, objective.progress + 10))}
                        disabled={objective.progress >= 100}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +10%
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Creado: {new Date(objective.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Objectives;
