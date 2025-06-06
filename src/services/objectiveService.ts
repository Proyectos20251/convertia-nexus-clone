
import { supabase } from "@/integrations/supabase/client";

export interface Objective {
  id: string;
  user_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
  };
  creator?: {
    full_name: string;
  };
}

export const objectiveService = {
  // Get user's objectives - simplified without joins for now
  async getUserObjectives(userId: string): Promise<Objective[]> {
    const { data, error } = await supabase
      .from('objectives')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching objectives:", error);
      throw error;
    }

    return data || [];
  },

  // Create objective
  async createObjective(objectiveData: {
    user_id: string;
    title: string;
    description?: string;
    target_date?: string;
  }): Promise<Objective> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('objectives')
      .insert({
        creator_id: user.id,
        ...objectiveData
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating objective:", error);
      throw error;
    }

    return data;
  },

  // Update objective progress
  async updateProgress(objectiveId: string, progress: number): Promise<void> {
    const { error } = await supabase
      .from('objectives')
      .update({ 
        progress,
        status: progress >= 100 ? 'completed' : 'active'
      })
      .eq('id', objectiveId);

    if (error) {
      console.error("Error updating objective progress:", error);
      throw error;
    }
  }
};
