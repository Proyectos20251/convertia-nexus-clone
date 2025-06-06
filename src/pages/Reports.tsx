
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { FileBarChart, Download, Filter, Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
}

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState<string[]>([]);

  const predefinedReports: Report[] = [
    {
      id: '1',
      name: 'Reporte de Asistencia',
      type: 'attendance',
      description: 'Análisis detallado de la asistencia de empleados',
      lastGenerated: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: '2',
      name: 'Reporte de Rendimiento',
      type: 'performance',
      description: 'Evaluaciones de rendimiento por departamento',
      lastGenerated: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: '3',
      name: 'Reporte de Capacitación',
      type: 'training',
      description: 'Progreso y finalización de cursos de capacitación',
      lastGenerated: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: '4',
      name: 'Reporte de Objetivos',
      type: 'objectives',
      description: 'Estado y progreso de objetivos organizacionales',
      lastGenerated: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: '5',
      name: 'Reporte de Ausencias',
      type: 'absences',
      description: 'Análisis de tipos y frecuencia de ausencias',
      lastGenerated: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: '6',
      name: 'Reporte Ejecutivo',
      type: 'executive',
      description: 'Resumen ejecutivo de métricas clave de RRHH',
      lastGenerated: new Date().toISOString(),
      status: 'ready'
    }
  ];

  useEffect(() => {
    fetchDepartments();
    setReports(predefinedReports);
    setIsLoading(false);
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_employees')
        .select('department')
        .not('department', 'is', null);

      if (error) throw error;

      const uniqueDepartments = [...new Set(data?.map(emp => emp.department))];
      setDepartments(uniqueDepartments.filter(Boolean));
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const generateReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    // Update status to generating
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: 'generating' as const } : r
    ));

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update status to ready
      setReports(prev => prev.map(r => 
        r.id === reportId ? { 
          ...r, 
          status: 'ready' as const, 
          lastGenerated: new Date().toISOString() 
        } : r
      ));

      toast.success('Reporte generado exitosamente');
    } catch (error) {
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, status: 'error' as const } : r
      ));
      toast.error('Error al generar el reporte');
    }
  };

  const downloadReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    try {
      // In a real implementation, this would call an API to generate and download the report
      toast.success(`Descargando ${report.name}...`);
      
      // Simulate file download
      const element = document.createElement('a');
      element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(`Reporte: ${report.name}\nGenerado: ${new Date().toLocaleString()}\n\nContenido del reporte...`)}`;
      element.download = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Error al descargar el reporte');
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <Clock className="h-5 w-5" />;
      case 'performance': return <TrendingUp className="h-5 w-5" />;
      case 'training': return <Users className="h-5 w-5" />;
      case 'objectives': return <TrendingUp className="h-5 w-5" />;
      case 'absences': return <Calendar className="h-5 w-5" />;
      case 'executive': return <FileBarChart className="h-5 w-5" />;
      default: return <FileBarChart className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Listo</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800">Generando</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    return selectedReportType === 'all' || report.type === selectedReportType;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">Cargando reportes...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reportes</h1>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Configurar Filtros
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros de Reporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reportType">Tipo de Reporte</Label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="attendance">Asistencia</SelectItem>
                    <SelectItem value="performance">Rendimiento</SelectItem>
                    <SelectItem value="training">Capacitación</SelectItem>
                    <SelectItem value="objectives">Objetivos</SelectItem>
                    <SelectItem value="absences">Ausencias</SelectItem>
                    <SelectItem value="executive">Ejecutivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department">Departamento</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los departamentos</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rango de Fechas</Label>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <FileBarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron reportes</p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getReportIcon(report.type)}
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                    </div>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-500">
                    Última generación: {new Date(report.lastGenerated).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => generateReport(report.id)}
                      disabled={report.status === 'generating'}
                      className="flex-1"
                    >
                      {report.status === 'generating' ? 'Generando...' : 'Generar'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => downloadReport(report.id)}
                      disabled={report.status !== 'ready'}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
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

export default Reports;
