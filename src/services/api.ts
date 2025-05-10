
import { supabase } from "@/integrations/supabase/client";

// Tipos
export interface TimeRecord {
  id?: string;
  user_id: string;
  check_in: string;
  check_out?: string | null;
  description?: string | null;
}

export interface Absence {
  id?: string;
  user_id: string;
  type_id: string;
  start_date: string;
  end_date: string;
  half_day?: boolean;
  status?: string;
  comment?: string | null;
}

// API del servicio de tiempo
export const timeService = {
  // Registrar hora de entrada
  async clockIn(userId: string): Promise<TimeRecord> {
    const { data, error } = await supabase
      .from('time_records')
      .insert({
        user_id: userId,
        check_in: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Registrar hora de salida
  async clockOut(recordId: string): Promise<void> {
    const { error } = await supabase
      .from('time_records')
      .update({
        check_out: new Date().toISOString()
      })
      .eq('id', recordId);

    if (error) throw error;
  },

  // Obtener registro activo
  async getActiveRecord(userId: string): Promise<TimeRecord | null> {
    const { data, error } = await supabase
      .from('time_records')
      .select('*')
      .eq('user_id', userId)
      .is('check_out', null)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  // Obtener historial de registros
  async getHistory(userId: string, limit = 10): Promise<TimeRecord[]> {
    const { data, error } = await supabase
      .from('time_records')
      .select('*')
      .eq('user_id', userId)
      .not('check_out', 'is', null)
      .order('check_in', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};

// API del servicio de ausencias
export const absenceService = {
  // Obtener todos los tipos de ausencia
  async getAbsenceTypes() {
    const { data, error } = await supabase
      .from('absence_types')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  // Solicitar una ausencia
  async requestAbsence(absence: Absence): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .insert(absence);

    if (error) throw error;
  },

  // Obtener mis ausencias
  async getMyAbsences(userId: string) {
    const { data, error } = await supabase
      .from('absences')
      .select(`
        *,
        absence_types (
          id, name, color
        )
      `)
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener ausencias del equipo
  async getTeamAbsences() {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('absences')
      .select(`
        *,
        profiles:user_id (
          id, full_name
        ),
        absence_types (
          id, name, color
        )
      `)
      .gte('end_date', today)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Aprobar una ausencia (para managers/admins)
  async approveAbsence(absenceId: string): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .update({
        status: 'approved'
      })
      .eq('id', absenceId);

    if (error) throw error;
  },

  // Rechazar una ausencia (para managers/admins)
  async rejectAbsence(absenceId: string): Promise<void> {
    const { error } = await supabase
      .from('absences')
      .update({
        status: 'rejected'
      })
      .eq('id', absenceId);

    if (error) throw error;
  }
};

// API del servicio de usuarios y perfiles
export const userService = {
  // Obtener perfil de usuario
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar perfil de usuario
  async updateProfile(userId: string, profile: Partial<any>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId);

    if (error) throw error;
  },

  // Obtener rol de usuario
  async getUserRole(userId: string) {
    const { data, error } = await supabase
      .rpc('get_user_role', { user_id: userId });

    if (error) {
      // Intentar obtener el rol de la tabla
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) throw roleError;
      return roleData?.role || 'collaborator';
    }

    return data || 'collaborator';
  }
};

// Suscripciones en tiempo real
export const setupRealTimeSubscriptions = (userId: string, callbacks: {
  onTimeRecordChange?: () => void;
  onAbsenceChange?: () => void;
}) => {
  const timeRecordsChannel = supabase
    .channel('custom-time-records-channel')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'time_records',
      filter: `user_id=eq.${userId}` 
    }, () => {
      if (callbacks.onTimeRecordChange) callbacks.onTimeRecordChange();
    })
    .subscribe();
    
  const absencesChannel = supabase
    .channel('custom-absences-channel')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'absences'
    }, () => {
      if (callbacks.onAbsenceChange) callbacks.onAbsenceChange();
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(timeRecordsChannel);
    supabase.removeChannel(absencesChannel);
  };
};
