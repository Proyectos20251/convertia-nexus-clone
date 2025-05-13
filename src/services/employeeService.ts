
import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  employment_type: string;
  work_location: string;
  department: string | null;
  team: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}

export const employeeService = {
  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('organization_employees')
      .select('*')
      .order('last_name', { ascending: true });

    if (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }

    return data || [];
  },

  // Get employee by ID
  async getEmployee(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('organization_employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No employee found
      }
      console.error("Error fetching employee:", error);
      throw error;
    }

    return data;
  },

  // Create a new employee
  async createEmployee(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee> {
    const { data, error } = await supabase
      .from('organization_employees')
      .insert(employee)
      .select()
      .single();

    if (error) {
      console.error("Error creating employee:", error);
      throw error;
    }

    return data;
  },

  // Update an existing employee
  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    const { data, error } = await supabase
      .from('organization_employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating employee:", error);
      throw error;
    }

    return data;
  },

  // Delete an employee
  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('organization_employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },

  // Get unique departments
  async getDepartments(): Promise<string[]> {
    const { data, error } = await supabase
      .from('organization_employees')
      .select('department')
      .not('department', 'is', null);

    if (error) {
      console.error("Error fetching departments:", error);
      throw error;
    }

    // Extract unique departments
    const departments = [...new Set(data.map(item => item.department))].filter(Boolean) as string[];
    return departments.sort();
  },

  // Get unique locations
  async getLocations(): Promise<string[]> {
    const { data, error } = await supabase
      .from('organization_employees')
      .select('work_location')
      .not('work_location', 'is', null);

    if (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }

    // Extract unique locations
    const locations = [...new Set(data.map(item => item.work_location))].filter(Boolean) as string[];
    return locations.sort();
  }
};
