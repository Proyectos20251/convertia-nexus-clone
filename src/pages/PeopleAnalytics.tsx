
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Clock, Award, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  departmentDistribution: { name: string; value: number; }[];
  performanceData: { period: string; average: number; }[];
  attendanceData: { month: string; present: number; absent: number; }[];
  trainingCompletion: { course: string; completion: number; }[];
}

const PeopleAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalEmployees: 0,
    activeEmployees: 0,
    departmentDistribution: [],
    performanceData: [],
    attendanceData: [],
    trainingCompletion: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch employees data
      const { data: employees, error: employeesError } = await supabase
        .from('organization_employees')
        .select('*');

      if (employeesError) throw employeesError;

      // Fetch performance reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('performance_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch training courses and enrollments
      const { data: courses, error: coursesError } = await supabase
        .from('training_courses')
        .select(`
          *,
          course_enrollments(*)
        `);

      if (coursesError) throw coursesError;

      // Process data
      const totalEmployees = employees?.length || 0;
      const activeEmployees = employees?.filter(emp => emp.status === 'Activo').length || 0;

      // Department distribution
      const departmentCounts = employees?.reduce((acc: any, emp) => {
        const dept = emp.department || 'Sin departamento';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      const departmentDistribution = Object.entries(departmentCounts || {}).map(([name, value]) => ({
        name,
        value: value as number
      }));

      // Performance data (mock for now)
      const performanceData = [
        { period: 'Q1 2024', average: 4.2 },
        { period: 'Q2 2024', average: 4.5 },
        { period: 'Q3 2024', average: 4.3 },
        { period: 'Q4 2024', average: 4.6 }
      ];

      // Attendance data (mock)
      const attendanceData = [
        { month: 'Ene', present: 95, absent: 5 },
        { month: 'Feb', present: 93, absent: 7 },
        { month: 'Mar', present: 97, absent: 3 },
        { month: 'Abr', present: 94, absent: 6 },
        { month: 'May', present: 96, absent: 4 },
        { month: 'Jun', present: 98, absent: 2 }
      ];

      // Training completion
      const trainingCompletion = courses?.map(course => {
        const enrollments = course.course_enrollments || [];
        const completed = enrollments.filter((e: any) => e.completed_at).length;
        const total = enrollments.length;
        const completion = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
          course: course.title,
          completion
        };
      }) || [];

      setAnalytics({
        totalEmployees,
        activeEmployees,
        departmentDistribution,
        performanceData,
        attendanceData,
        trainingCompletion
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error al cargar los datos analíticos');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando analíticas...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">People Analytics</h1>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mes</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Empleados</p>
                  <p className="text-2xl font-bold">{analytics.totalEmployees}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.activeEmployees}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa de Retención</p>
                  <p className="text-2xl font-bold text-blue-600">94%</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Asistencia Promedio</p>
                  <p className="text-2xl font-bold text-green-600">96%</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="training">Capacitación</TabsTrigger>
          </TabsList>

          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Departamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.departmentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Evolución del Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="average" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Asistencia Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#82ca9d" name="Presente" />
                    <Bar dataKey="absent" fill="#ff7c7c" name="Ausente" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Finalización de Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.trainingCompletion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="completion" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PeopleAnalytics;
