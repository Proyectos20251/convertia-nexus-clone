
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

export interface Message {
  id?: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  is_read?: boolean;
  has_attachment?: boolean;
  attachment_url?: string | null;
  created_at?: string;
}

export interface Permission {
  id?: string;
  role_name: string;
  module_name: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

// API del servicio de tiempo
export const timeService = {
  // Registrar hora de entrada
  async clockIn(userId: string, description?: string): Promise<TimeRecord> {
    const { data, error } = await supabase
      .from('time_records')
      .insert({
        user_id: userId,
        check_in: new Date().toISOString(),
        description
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
  },
  
  // Suscribirse a cambios en tiempo real
  subscribeToTimeRecords(userId: string, callback: () => void) {
    const channel = supabase
      .channel('time-records-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'time_records',
        filter: `user_id=eq.${userId}`
      }, () => {
        callback();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
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
  },
  
  // Obtener todos los usuarios
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles!user_roles(role)
      `)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  },
  
  // Obtener permisos por rol
  async getPermissionsByRole(roleName: string): Promise<Permission[]> {
    try {
      // Using a type assertion since role_permissions is not in the types
      const { data, error } = await supabase
        .from('role_permissions' as any)
        .select('*')
        .eq('role_name', roleName);
  
      if (error) throw error;
      
      // More explicit type handling to prevent errors
      if (!data) return [];
      
      // First cast to unknown, then to Permission[] to avoid direct conversion errors
      return (data as unknown) as Permission[];
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return [];
    }
  },
  
  // Actualizar permiso
  async updatePermission(roleName: string, moduleName: string, permissions: Partial<Permission>): Promise<void> {
    try {
      const { error } = await supabase
        .from('role_permissions' as any)
        .update(permissions as any)
        .eq('role_name', roleName)
        .eq('module_name', moduleName);
  
      if (error) throw error;
    } catch (error) {
      console.error("Error updating permissions:", error);
      throw error;
    }
  }
};

// API para servicio de documentos
export const documentService = {
  // Subir un documento
  async uploadDocument(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
  
  // Registrar documento en la base de datos
  async createDocument(document: { name: string, file_url: string, file_type: string, user_id: string }): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .insert(document);
      
    if (error) throw error;
  },
  
  // Obtener documentos del usuario
  async getUserDocuments(userId: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  // Obtener documentos compartidos (para managers/admins)
  async getSharedDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        profiles:user_id (
          id, full_name
        )
      `)
      .eq('status', 'shared')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  // Eliminar documento
  async deleteDocument(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
      
    if (error) throw error;
  },
  
  // Suscribirse a cambios en tiempo real
  subscribeToDocuments(callback: () => void) {
    const channel = supabase
      .channel('documents-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'documents'
      }, () => {
        callback();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// API para los mensajes
export const messageService = {
  // Enviar un mensaje
  async sendMessage(message: Message): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages' as any)
        .insert(message as any);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
  
  // Obtener mensajes recibidos
  async getInboxMessages(userId: string) {
    try {
      const { data, error } = await supabase
        .from('messages' as any)
        .select(`
          *,
          sender:sender_id (
            id, full_name, avatar_url
          )
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
      return [];
    }
  },
  
  // Obtener mensajes enviados
  async getSentMessages(userId: string) {
    try {
      const { data, error } = await supabase
        .from('messages' as any)
        .select(`
          *,
          recipient:recipient_id (
            id, full_name, avatar_url
          )
        `)
        .eq('sender_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching sent messages:", error);
      return [];
    }
  },
  
  // Marcar mensaje como leído
  async markAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages' as any)
        .update({ is_read: true } as any)
        .eq('id', messageId);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  },
  
  // Eliminar mensaje
  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages' as any)
        .delete()
        .eq('id', messageId);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },
  
  // Suscribirse a mensajes en tiempo real
  subscribeToMessages(userId: string, callback: () => void) {
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*', 
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${userId}`
      }, () => {
        callback();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
};

// Suscripciones en tiempo real
export const setupRealTimeSubscriptions = (userId: string, callbacks: {
  onTimeRecordChange?: () => void;
  onAbsenceChange?: () => void;
  onMessageChange?: () => void;
  onDocumentChange?: () => void;
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
    
  const messagesChannel = supabase
    .channel('custom-messages-channel')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'messages',
      filter: `recipient_id=eq.${userId}` 
    }, () => {
      if (callbacks.onMessageChange) callbacks.onMessageChange();
    })
    .subscribe();
    
  const documentsChannel = supabase
    .channel('custom-documents-channel')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'documents'
    }, () => {
      if (callbacks.onDocumentChange) callbacks.onDocumentChange();
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(timeRecordsChannel);
    supabase.removeChannel(absencesChannel);
    supabase.removeChannel(messagesChannel);
    supabase.removeChannel(documentsChannel);
  };
};
