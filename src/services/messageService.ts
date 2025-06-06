
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string;
  content: string;
  is_read: boolean;
  message_type: string;
  created_at: string;
  updated_at: string;
  sender?: {
    full_name: string;
  };
  recipient?: {
    full_name: string;
  };
}

export const messageService = {
  // Get messages for current user
  async getUserMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(full_name),
        recipient:profiles!recipient_id(full_name)
      `)
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    return data || [];
  },

  // Send a message
  async sendMessage(messageData: {
    recipient_id: string | null;
    subject: string;
    content: string;
    message_type?: string;
  }): Promise<Message> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        ...messageData
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    return data;
  },

  // Mark message as read
  async markAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }
};
