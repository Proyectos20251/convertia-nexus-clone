
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Employee, employeeService } from "@/services/employeeService";

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: (employee: Partial<Employee>) => Promise<void>;
}

export default function EmployeeDialog({ isOpen, onClose, employee, onSave }: EmployeeDialogProps) {
  const [form, setForm] = useState<Partial<Employee>>({
    first_name: "",
    last_name: "",
    email: "",
    status: "Activo",
    employment_type: "Interno",
    work_location: "",
    department: "",
    team: "",
    position: "",
  });
  const [departments, setDepartments] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load departments and locations
  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptsData, locsData] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getLocations()
        ]);
        
        setDepartments(deptsData);
        setLocations(locsData);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadData();
  }, []);

  // Update form when employee changes
  useEffect(() => {
    if (employee) {
      setForm({
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        email: employee.email || "",
        status: employee.status || "Activo",
        employment_type: employee.employment_type || "Interno",
        work_location: employee.work_location || "",
        department: employee.department || "",
        team: employee.team || "",
        position: employee.position || "",
      });
    } else {
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        status: "Activo",
        employment_type: "Interno",
        work_location: "",
        department: "",
        team: "",
        position: "",
      });
    }
  }, [employee, isOpen]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.first_name || !form.last_name || !form.email || !form.work_location) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(form);
      toast.success(employee ? "Empleado actualizado correctamente" : "Empleado creado correctamente");
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Error al guardar los datos del empleado");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{employee ? "Editar empleado" : "Nuevo empleado"}</DialogTitle>
          <DialogDescription>
            {employee ? "Actualizar la información del empleado" : "Añadir un nuevo empleado a la organización"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={form.status} 
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de empleo</Label>
                <Select 
                  value={form.employment_type} 
                  onValueChange={(value) => handleChange("employment_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interno">Interno</SelectItem>
                    <SelectItem value="Externo">Externo</SelectItem>
                    <SelectItem value="Contratista">Contratista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Centro de trabajo *</Label>
              <Select 
                value={form.work_location} 
                onValueChange={(value) => handleChange("work_location", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione ubicación" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select 
                  value={form.department || ""} 
                  onValueChange={(value) => handleChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                    <SelectItem value="">Sin departamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team">Equipo</Label>
                <Input
                  id="team"
                  value={form.team || ""}
                  onChange={(e) => handleChange("team", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Puesto</Label>
              <Input
                id="position"
                value={form.position || ""}
                onChange={(e) => handleChange("position", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Guardando..." 
                : employee ? "Actualizar" : "Crear"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
