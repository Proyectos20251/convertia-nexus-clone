
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");

  const personalInfo = {
    email: "user@convertia.com",
    phone: "+34 666 123 456",
    address: "Calle Gran Vía 123, Madrid",
    birthdate: "15/08/1988",
    nationality: "Española",
    idNumber: "12345678X",
    joinDate: "10/01/2020",
    department: "Desarrollo",
    position: "Desarrollador Frontend",
    manager: "Carlos López",
    employeeId: "EMP-2020-001",
    workSchedule: "Lun-Vie, 9:00 - 18:00",
    workLocation: "Madrid (Híbrido)",
  };

  // Mock documents
  const documents = [
    {
      id: 1,
      type: "Contrato",
      name: "Contrato laboral",
      date: "10/01/2020",
      status: "Activo",
    },
    {
      id: 2,
      type: "Nómina",
      name: "Nómina - Abril 2023",
      date: "30/04/2023",
      status: "Firmado",
    },
    {
      id: 3,
      type: "Nómina",
      name: "Nómina - Marzo 2023",
      date: "31/03/2023",
      status: "Firmado",
    },
    {
      id: 4,
      type: "Certificado",
      name: "Certificado de Empresa",
      date: "15/02/2023",
      status: "Disponible",
    },
    {
      id: 5,
      type: "Formulario",
      name: "Solicitud de vacaciones 2023",
      date: "20/01/2023",
      status: "Aprobado",
    },
  ];

  // Mock time records
  const timeRecords = [
    {
      date: "08/05/2023",
      clockIn: "09:05",
      clockOut: "18:10",
      break: "01:00",
      total: "08:05",
      status: "Completado",
    },
    {
      date: "05/05/2023",
      clockIn: "09:00",
      clockOut: "18:00",
      break: "01:00",
      total: "08:00",
      status: "Completado",
    },
    {
      date: "04/05/2023",
      clockIn: "08:55",
      clockOut: "18:15",
      break: "01:00",
      total: "08:20",
      status: "Completado",
    },
    {
      date: "03/05/2023",
      clockIn: "09:10",
      clockOut: "18:05",
      break: "01:00",
      total: "07:55",
      status: "Completado",
    },
    {
      date: "02/05/2023",
      clockIn: "09:00",
      clockOut: "18:00",
      break: "01:00",
      total: "08:00",
      status: "Completado",
    },
  ];

  // Mock leave requests
  const leaveRequests = [
    {
      id: 1,
      type: "Vacaciones",
      startDate: "10/06/2023",
      endDate: "17/06/2023",
      days: 6,
      status: "Pendiente",
    },
    {
      id: 2,
      type: "Trabajo remoto",
      startDate: "02/05/2023",
      endDate: "02/05/2023",
      days: 1,
      status: "Aprobado",
    },
    {
      id: 3,
      type: "Asuntos personales",
      startDate: "15/04/2023",
      endDate: "15/04/2023",
      days: 1,
      status: "Aprobado",
    },
    {
      id: 4,
      type: "Vacaciones",
      startDate: "05/01/2023",
      endDate: "09/01/2023",
      days: 5,
      status: "Aprobado",
    },
  ];

  // Mock notes
  const notes = [
    {
      id: 1,
      date: "25/04/2023",
      author: "Carlos López",
      content: "Revisión de desempeño realizada con éxito. Se ha destacado la buena capacidad para trabajar en equipo y la calidad del trabajo entregado.",
    },
    {
      id: 2,
      date: "10/03/2023",
      author: "RR.HH.",
      content: "Actualización de datos personales completada. Se ha actualizado la dirección postal y el número de teléfono.",
    },
    {
      id: 3,
      date: "15/02/2023",
      author: "Carlos López",
      content: "Se ha autorizado la participación en el curso de formación avanzada de React propuesto por el empleado.",
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Profile header */}
        <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start mb-6">
          <div className="flex flex-col items-center mr-6 mb-4 md:mb-0">
            <Avatar className="h-24 w-24 mb-3">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="text-sm">
              Cambiar foto
            </Button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
            <div className="text-gray-600 mb-1">{user?.position}</div>
            <div className="text-gray-500 text-sm mb-4">{user?.department}</div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-1" />
                {personalInfo.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-1" />
                {personalInfo.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {personalInfo.workLocation}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                Incorporación: {personalInfo.joinDate}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="about">Acerca de</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="timerecords">Registro de jornada</TabsTrigger>
            <TabsTrigger value="leaves">Días libres</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          
          {/* About tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Información personal</CardTitle>
                <CardDescription>
                  Detalles sobre tu perfil y situación en la empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Información personal</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Nombre completo</div>
                        <div>{user?.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Correo electrónico</div>
                        <div>{personalInfo.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Teléfono</div>
                        <div>{personalInfo.phone}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Dirección</div>
                        <div>{personalInfo.address}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Fecha de nacimiento</div>
                        <div>{personalInfo.birthdate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Nacionalidad</div>
                        <div>{personalInfo.nationality}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">DNI/NIE</div>
                        <div>{personalInfo.idNumber}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Información laboral</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">ID de empleado</div>
                        <div>{personalInfo.employeeId}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Fecha de incorporación</div>
                        <div>{personalInfo.joinDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Departamento</div>
                        <div>{personalInfo.department}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cargo</div>
                        <div>{personalInfo.position}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Responsable</div>
                        <div>{personalInfo.manager}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Horario</div>
                        <div>{personalInfo.workSchedule}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Ubicación</div>
                        <div>{personalInfo.workLocation}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documents tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Mis documentos</CardTitle>
                <CardDescription>
                  Contratos, nóminas y otros documentos importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Mostrando {documents.length} documentos
                  </div>
                  <Button variant="outline" className="text-sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir documento
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="w-full">Nombre</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Badge variant="outline">{doc.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            {doc.name}
                          </TableCell>
                          <TableCell>{doc.date}</TableCell>
                          <TableCell>
                            <Badge className={
                              doc.status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : doc.status === "Firmado"
                                ? "bg-blue-100 text-blue-800"
                                : doc.status === "Disponible"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800"
                            }>
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Time records tab */}
          <TabsContent value="timerecords">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Mi registro de jornada</CardTitle>
                <CardDescription>
                  Historial de tus entradas y salidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead>Descanso</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeRecords.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.clockIn}</TableCell>
                          <TableCell>{record.clockOut}</TableCell>
                          <TableCell>{record.break}</TableCell>
                          <TableCell className="font-medium">{record.total}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Days off tab */}
          <TabsContent value="leaves">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Mis días libres</CardTitle>
                <CardDescription>
                  Historial y solicitudes de ausencias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Vacaciones</div>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-gray-800 mr-2">18</span>
                      <span className="text-sm text-gray-500">días disponibles</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">2</span> días usados este año
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Trabajo remoto</div>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-gray-800 mr-2">6</span>
                      <span className="text-sm text-gray-500">días disponibles</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">4</span> días usados este año
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Asuntos personales</div>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold text-gray-800 mr-2">3</span>
                      <span className="text-sm text-gray-500">días disponibles</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">1</span> día usado este año
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="font-medium">Historial de solicitudes</h3>
                  <Button variant="outline" className="text-sm">
                    Nueva solicitud
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha inicio</TableHead>
                        <TableHead>Fecha fin</TableHead>
                        <TableHead>Días</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>
                            <Badge variant="outline">{leave.type}</Badge>
                          </TableCell>
                          <TableCell>{leave.startDate}</TableCell>
                          <TableCell>{leave.endDate}</TableCell>
                          <TableCell>{leave.days}</TableCell>
                          <TableCell>
                            <Badge className={
                              leave.status === "Aprobado"
                                ? "bg-green-100 text-green-800"
                                : leave.status === "Pendiente"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }>
                              {leave.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notes tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Notas</CardTitle>
                <CardDescription>
                  Comentarios y notas sobre tu actividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {notes.map((note) => (
                    <li key={note.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{note.author}</span>
                        <span className="text-sm text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{note.content}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
