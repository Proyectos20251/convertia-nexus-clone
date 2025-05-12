
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import OrganizationChart from "@/components/organization/OrganizationChart";

export default function Organization() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for employees
  const employees = [
    {
      id: 1,
      name: "Ana Martínez",
      position: "Directora General",
      department: "Dirección",
      location: "Madrid",
      avatar: "https://i.pravatar.cc/150?img=5",
      manager: null
    },
    {
      id: 2,
      name: "Carlos López",
      position: "Director de Tecnología",
      department: "Tecnología",
      location: "Barcelona",
      avatar: "https://i.pravatar.cc/150?img=8",
      manager: 1
    },
    {
      id: 3,
      name: "Elena González",
      position: "Gerente de Producto",
      department: "Producto",
      location: "Madrid",
      avatar: "https://i.pravatar.cc/150?img=9",
      manager: 1
    },
    {
      id: 4,
      name: "Roberto Sánchez",
      position: "Desarrollador Senior",
      department: "Tecnología",
      location: "Valencia",
      avatar: "https://i.pravatar.cc/150?img=12",
      manager: 2
    },
    {
      id: 5,
      name: "Laura Castro",
      position: "Diseñadora UX",
      department: "Producto",
      location: "Madrid",
      avatar: "https://i.pravatar.cc/150?img=16",
      manager: 3
    },
    {
      id: 6,
      name: "Miguel Torres",
      position: "Analista de Marketing",
      department: "Marketing",
      location: "Barcelona",
      avatar: "https://i.pravatar.cc/150?img=20",
      manager: 1
    },
    {
      id: 7,
      name: "Sofia Reyes",
      position: "Desarrolladora Frontend",
      department: "Tecnología",
      location: "Valencia",
      avatar: "https://i.pravatar.cc/150?img=25",
      manager: 2
    },
    {
      id: 8,
      name: "David Ruiz",
      position: "Diseñador Gráfico",
      department: "Producto",
      location: "Madrid",
      avatar: "https://i.pravatar.cc/150?img=30",
      manager: 3
    },
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock departments for Organigrama section
  const departments = [
    {
      id: 1,
      name: "Dirección",
      head: "Ana Martínez",
      employeeCount: 3,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      name: "Tecnología",
      head: "Carlos López",
      employeeCount: 12,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 3,
      name: "Producto",
      head: "Elena González",
      employeeCount: 8,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Marketing",
      head: "David Ramírez",
      employeeCount: 6,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: 5,
      name: "Ventas",
      head: "Isabel Navarro",
      employeeCount: 10,
      color: "bg-red-100 text-red-800",
    },
    {
      id: 6,
      name: "Recursos Humanos",
      head: "Pedro Blanco",
      employeeCount: 4,
      color: "bg-teal-100 text-teal-800",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Organización</h1>

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
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre, cargo, departamento..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center bg-white border rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b text-xs uppercase text-gray-500">
                        <th className="px-4 py-3 text-left font-medium">Empleado</th>
                        <th className="px-4 py-3 text-left font-medium">Cargo</th>
                        <th className="px-4 py-3 text-left font-medium">Departamento</th>
                        <th className="px-4 py-3 text-left font-medium">Ubicación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <tr key={employee.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={employee.avatar} />
                                  <AvatarFallback>
                                    {employee.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{employee.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {employee.position}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {employee.department}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {employee.location}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No se encontraron empleados con esos criterios
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                <OrganizationChart data={employees} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.map((department) => (
                    <div 
                      key={department.id} 
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={department.color}>
                          {department.name}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {department.employeeCount} empleados
                        </span>
                      </div>
                      <h3 className="font-medium">Director de departamento:</h3>
                      <p className="text-gray-600 mb-4">{department.head}</p>
                      <button className="text-sm text-teal-700 hover:underline">
                        Ver estructura completa
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
