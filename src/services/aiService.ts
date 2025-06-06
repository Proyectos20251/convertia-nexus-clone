
import { supabase } from "@/integrations/supabase/client";

export interface AIChat {
  id: string;
  user_id: string;
  message: string;
  response: string;
  chat_type: string;
  created_at: string;
}

export interface AIUsageLimit {
  id: string;
  user_id: string;
  usage_date: string;
  requests_count: number;
  created_at: string;
}

export const aiService = {
  // Get user's chat history
  async getChatHistory(userId: string): Promise<AIChat[]> {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }

    return data || [];
  },

  // Check daily usage limit
  async checkUsageLimit(userId: string): Promise<{ canUse: boolean; remaining: number }> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('ai_usage_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('usage_date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error checking usage limit:", error);
      throw error;
    }

    // Get user role to determine limit
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const role = roleData?.role || 'collaborator';
    const dailyLimit = ['admin', 'manager'].includes(role) ? 20 : 5;
    
    const currentUsage = data?.requests_count || 0;
    const remaining = Math.max(0, dailyLimit - currentUsage);

    return {
      canUse: remaining > 0,
      remaining
    };
  },

  // Increment usage count
  async incrementUsage(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('ai_usage_limits')
      .upsert({
        user_id: userId,
        usage_date: today,
        requests_count: 1
      }, {
        onConflict: 'user_id,usage_date',
        ignoreDuplicates: false
      });

    if (error) {
      console.error("Error incrementing usage:", error);
      throw error;
    }
  },

  // Save chat interaction
  async saveChatInteraction(userId: string, message: string, response: string, chatType: string = 'assistant'): Promise<void> {
    const { error } = await supabase
      .from('ai_chat_history')
      .insert({
        user_id: userId,
        message,
        response,
        chat_type: chatType
      });

    if (error) {
      console.error("Error saving chat interaction:", error);
      throw error;
    }
  }
};
