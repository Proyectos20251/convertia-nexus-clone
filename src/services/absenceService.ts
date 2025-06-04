
import { supabase } from "@/integrations/supabase/client";

export interface AbsenceType {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  requires_approval: boolean;
}

export interface Absence {
  id: string;
  user_id: string;
  type_id: string;
  start_date: string;
  end_date: string;
  half_day: boolean | null;
  comment: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  absence_type?: AbsenceType;
  profile?: {
    full_name: string;
    department: string | null;
    position: string | null;
  };
}

export interface AbsenceRequestData {
  type_id: string;
  start_date: string;
  end_date: string;
  half_day?: boolean;
  comment?: string;
}

export const absenceService = {
  // Get all absence types
  async getAbsenceTypes(): Promise<AbsenceType[]> {
    const { data, error } = await supabase
      .from('absence_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching absence types:", error);
      throw error;
    }

    return data || [];
  },

  // Request an absence
  async requestAbsence(userId: string, absenceData: AbsenceRequestData): Promise<Absence> {
    const { data, error } = await supabase
      .from('absences')
      .insert({
        user_id: userId,
        type_id: absenceData.type_id,
        start_date: absenceData.start_date,
        end_date: absenceData.end_date,
        half_day: absenceData.half_day,
        comment: absenceData.comment,
        status: 'pending'
      })
      .select(`
        *,
        absence_types!type_id(*)
      `)
      .single();

    if (error) {
      console.error("Error requesting absence:", error);
      throw error;
    }

    return data;
  },

  // Get user's absences
  async getUserAbsences(userId: string): Promise<Absence[]> {
    const { data, error } = await supabase
      .from('absences')
      .select(`
        *,
        absence_types!type_id(*)
      `)
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Error fetching user absences:", error);
      throw error;
    }

    return data || [];
  },

  // Get team absences (for managers)
  async getTeamAbsences(managerId: string): Promise<Absence[]> {
    // First, get the department of the manager
    const { data: managerData, error: managerError } = await supabase
      .from('profiles')
      .select('department')
      .eq('id', managerId)
      .single();

    if (managerError) {
      console.error("Error fetching manager profile:", managerError);
      throw managerError;
    }

    if (!managerData.department) {
      return []; // Manager doesn't have a department assigned
    }

    // Get team members in the same department
    const { data: teamMembersData, error: teamError } = await supabase
      .from('profiles')
      .select('id')
      .eq('department', managerData.department);

    if (teamError) {
      console.error("Error fetching team members:", teamError);
      throw teamError;
    }

    if (!teamMembersData.length) {
      return []; // No team members found
    }

    // Get absences for all team members
    const teamMemberIds = teamMembersData.map(member => member.id);
    
    const { data, error } = await supabase
      .from('absences')
      .select(`
        *,
        absence_types!type_id(*),
        profiles!user_id(
          full_name,
          department,
          position
        )
      `)
      .in('user_id', teamMemberIds)
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Error fetching team absences:", error);
      throw error;
    }

    return data || [];
  },

  // Get all absences (admin only)
  async getAllAbsences(): Promise<Absence[]> {
    const { data, error } = await supabase
      .from('absences')
      .select(`
        *,
        absence_types!type_id(*),
        profiles!user_id(
          full_name,
          department,
          position
        )
      `)
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Error fetching all absences:", error);
      throw error;
    }

    return data || [];
  },

  // Approve absence
  async approveAbsence(absenceId: string): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .update({ status: 'approved' })
      .eq('id', absenceId);

    if (error) {
      console.error("Error approving absence:", error);
      throw error;
    }
  },

  // Reject absence
  async rejectAbsence(absenceId: string): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .update({ status: 'rejected' })
      .eq('id', absenceId);

    if (error) {
      console.error("Error rejecting absence:", error);
      throw error;
    }
  },

  // Cancel absence (by the requesting user)
  async cancelAbsence(absenceId: string): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .update({ status: 'cancelled' })
      .eq('id', absenceId);

    if (error) {
      console.error("Error cancelling absence:", error);
      throw error;
    }
  }
};
