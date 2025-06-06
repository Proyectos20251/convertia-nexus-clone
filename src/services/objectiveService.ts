
import { supabase } from "@/integrations/supabase/client";

export interface Objective {
  id: string;
  user_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export const objectiveService = {
  async getUserObjectives(userId: string): Promise<Objective[]> {
    if (!userId) {
      console.warn("No user ID provided for getUserObjectives");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('objectives')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching objectives:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error in getUserObjectives:", error);
      return [];
    }
  },

  async createObjective(objective: Omit<Objective, 'id' | 'created_at' | 'updated_at'>): Promise<Objective | null> {
    try {
      const { data, error } = await supabase
        .from('objectives')
        .insert(objective)
        .select()
        .single();

      if (error) {
        console.error("Error creating objective:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in createObjective:", error);
      return null;
    }
  },

  async updateObjective(id: string, updates: Partial<Objective>): Promise<Objective | null> {
    try {
      const { data, error } = await supabase
        .from('objectives')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating objective:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error in updateObjective:", error);
      return null;
    }
  },

  async deleteObjective(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('objectives')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting objective:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in deleteObjective:", error);
      return false;
    }
  }
};
