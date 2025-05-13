
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Edit, Plus, Trash2, User } from "lucide-react";
import OrganizationChart from "@/components/organization/OrganizationChart";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Employee, employeeService } from "@/services/employeeService";
import EmployeeDialog from "@/components/organization/EmployeeDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Organization() {
  const { role } = useAuth();
  const isAdminOrManager = role === 'admin' || role === 'manager';
  const queryClient = useQueryClient();
  
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch employees data
  const { 
    data: employees = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAllEmployees
  });

  // Get unique departments and locations for filters
  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))].sort();
  const locations = [...new Set(employees.map(emp => emp.work_location))].sort();
  
  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      return employeeService.createEmployee(employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) => {
      return employeeService.updateEmployee(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return employeeService.deleteEmployee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success("Empleado eliminado correctamente");
    },
    onError: (error) => {
      console.error("Error deleting employee:", error);
      toast.error("Error al eliminar el empleado");
    }
  });

  // Filter employees based on search term and filters
  const filteredEmployees = employees.filter(
    (employee) => {
      const matchesSearch = 
        `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.work_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !filterLocation || employee.work_location === filterLocation;
      const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
      
      return matchesSearch && matchesLocation && matchesDepartment;
    }
  );

  // Handle employee operations
  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      if (selectedEmployee) {
        // Update existing employee
        await updateMutation.mutateAsync({ 
          id: selectedEmployee.id, 
          data: employeeData 
        });
      } else {
        // Create new employee
        await createMutation.mutateAsync(employeeData as Omit<Employee, 'id' | 'created_at' | 'updated_at'>);
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const confirmDeleteEmployee = () => {
    if (selectedEmployee) {
      deleteMutation.mutate(selectedEmployee.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterLocation("");
    setFilterDepartment("");
  };

  // Transform data for organization chart
  const chartData = employees.map(emp => ({
    id: emp.id,
    name: `${emp.first_name} ${emp.last_name}`,
    position: emp.position || "",
    department: emp.department || "",
    // For manager, we'll need a way to associate employees with their managers
    manager: null, // This would need to be defined in your database
    avatar: null // This would be the employee's avatar if available
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Organización</h1>
          
          {isAdminOrManager && (
            <Button 
              onClick={handleCreateEmployee}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Nuevo empleado
            </Button>
          )}
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="organigrama">Organigrama</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Directorio de empleados</CardTitle>
                <CardDescription>
                  Consulta información sobre todos los miembros de la organización
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre, cargo, departamento..."
                      className="pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                        {(filterLocation || filterDepartment) && (
                          <Badge variant="secondary" className="ml-2 h-5">
                            {(filterLocation && filterDepartment) ? '2' : '1'}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="p-2">
                        <p className="text-xs font-medium mb-2">Ubicación</p>
                        <select
                          className="w-full p-2 text-sm border rounded"
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                        >
                          <option value="">Todas</option>
                          {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="p-2">
                        <p className="text-xs font-medium mb-2">Departamento</p>
                        <select
                          className="w-full p-2 text-sm border rounded"
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                        >
                          <option value="">Todos</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      {(filterLocation || filterDepartment) && (
                        <div className="p-2 border-t">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-center text-xs" 
                            onClick={resetFilters}
                          >
                            Limpiar filtros
                          </Button>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    Error al cargar los datos. Por favor, inténtalo de nuevo.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead>
                        <tr className="border-b text-xs uppercase text-gray-500">
                          <th className="px-4 py-3 text-left font-medium">Empleado</th>
                          <th className="px-4 py-3 text-left font-medium">Cargo</th>
                          <th className="px-4 py-3 text-left font-medium">Departamento</th>
                          <th className="px-4 py-3 text-left font-medium">Ubicación</th>
                          {isAdminOrManager && (
                            <th className="px-4 py-3 text-right font-medium">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <tr key={employee.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3">
                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                                      {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="font-medium">{employee.first_name} {employee.last_name}</span>
                                    <p className="text-xs text-gray-500">{employee.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {employee.position || "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {employee.department ? (
                                  <div>
                                    <span>{employee.department}</span>
                                    {employee.team && (
                                      <p className="text-xs text-gray-500">{employee.team}</p>
                                    )}
                                  </div>
                                ) : "-"}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {employee.work_location}
                              </td>
                              {isAdminOrManager && (
                                <td className="px-4 py-3 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handleEditEmployee(employee)}
                                    >
                                      <span className="sr-only">Editar</span>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => handleDeleteEmployee(employee)}
                                    >
                                      <span className="sr-only">Eliminar</span>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isAdminOrManager ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                              No se encontraron empleados con esos criterios
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    
                    <div className="mt-4 px-4 text-sm text-gray-500">
                      Mostrando {filteredEmployees.length} de {employees.length} empleados
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="organigrama">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Organigrama interactivo</CardTitle>
                <CardDescription>
                  Visualización de la estructura organizativa
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    Error al cargar los datos. Por favor, inténtalo de nuevo.
                  </div>
                ) : (
                  <OrganizationChart data={chartData} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Departamentos</CardTitle>
                <CardDescription>
                  Estructura organizativa por departamentos y equipos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {departments.map((department) => {
                      const deptEmployees = employees.filter(emp => emp.department === department);
                      const deptHead = deptEmployees.find(emp => 
                        emp.position?.toLowerCase().includes('head') || 
                        emp.position?.toLowerCase().includes('director') ||
                        emp.position?.toLowerCase().includes('manager')
                      );
                      
                      // Generate a consistent color for each department
                      const colorClasses = [
                        "bg-blue-100 text-blue-800",
                        "bg-purple-100 text-purple-800",
                        "bg-green-100 text-green-800",
                        "bg-orange-100 text-orange-800",
                        "bg-red-100 text-red-800",
                        "bg-teal-100 text-teal-800",
                        "bg-pink-100 text-pink-800",
                        "bg-indigo-100 text-indigo-800"
                      ];
                      
                      const colorIndex = department.charCodeAt(0) % colorClasses.length;
                      const color = colorClasses[colorIndex];
                      
                      return (
                        <div 
                          key={department} 
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <Badge className={color}>
                              {department}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {deptEmployees.length} empleados
                            </span>
                          </div>
                          
                          <h3 className="font-medium">Director de departamento:</h3>
                          
                          {deptHead ? (
                            <div className="flex items-center mt-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
                                  {deptHead.first_name.charAt(0)}{deptHead.last_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{deptHead.first_name} {deptHead.last_name}</p>
                                <p className="text-xs text-gray-500">{deptHead.position}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600 mb-4">No asignado</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Employee Dialog */}
      <EmployeeDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        employee={selectedEmployee} 
        onSave={handleSaveEmployee} 
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente al empleado 
              {selectedEmployee && (
                <span className="font-medium"> {selectedEmployee.first_name} {selectedEmployee.last_name}</span>
              )} 
              del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteEmployee}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
