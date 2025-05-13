
import { supabase } from "@/integrations/supabase/client";

interface AbsenceType {
  name: string;
  description?: string;
  color: string;
  requires_approval: boolean;
}

export const setupDefaultAbsenceTypes = async () => {
  // First check if we already have absence types
  const { data, error } = await supabase
    .from('absence_types')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error("Error checking absence types:", error);
    return;
  }
  
  // If we already have types, don't create new ones
  if (data && data.length > 0) {
    console.log("Absence types already exist");
    return;
  }
  
  // Default absence types
  const defaultTypes: AbsenceType[] = [
    {
      name: "Vacaciones",
      description: "Días de vacaciones anuales",
      color: "#4ade80",
      requires_approval: true
    },
    {
      name: "Enfermedad",
      description: "Ausencia por motivos de salud",
      color: "#f87171",
      requires_approval: true
    },
    {
      name: "Asuntos personales",
      description: "Permiso para atender asuntos personales",
      color: "#60a5fa",
      requires_approval: true
    },
    {
      name: "Remoto",
      description: "Trabajo desde casa u otra ubicación",
      color: "#a78bfa",
      requires_approval: true
    },
    {
      name: "Formación",
      description: "Ausencia por cursos o formación",
      color: "#fbbf24",
      requires_approval: true
    }
  ];
  
  // Create the default types
  const { error: insertError } = await supabase
    .from('absence_types')
    .insert(defaultTypes);
    
  if (insertError) {
    console.error("Error creating default absence types:", insertError);
    return;
  }
  
  console.log("Default absence types created successfully");
};
