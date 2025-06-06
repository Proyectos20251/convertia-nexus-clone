
import { supabase } from "@/integrations/supabase/client";

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
}

export interface CompetencyEvaluation {
  id: string;
  user_id: string;
  competency_id: string;
  evaluator_id: string;
  score: number;
  comments: string;
  evaluation_period: string;
  created_at: string;
}

export const competencyService = {
  async getCompetencies(): Promise<Competency[]> {
    const { data, error } = await supabase
      .from('competencies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching competencies:", error);
      throw error;
    }

    return data || [];
  },

  async createCompetency(competency: Omit<Competency, 'id' | 'created_at'>): Promise<Competency> {
    const { data, error } = await supabase
      .from('competencies')
      .insert(competency)
      .select()
      .single();

    if (error) {
      console.error("Error creating competency:", error);
      throw error;
    }

    return data;
  },

  async getUserEvaluations(userId: string): Promise<CompetencyEvaluation[]> {
    const { data, error } = await supabase
      .from('competency_evaluations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching evaluations:", error);
      throw error;
    }

    return data || [];
  },

  async createEvaluation(evaluation: Omit<CompetencyEvaluation, 'id' | 'created_at'>): Promise<CompetencyEvaluation> {
    const { data, error } = await supabase
      .from('competency_evaluations')
      .insert(evaluation)
      .select()
      .single();

    if (error) {
      console.error("Error creating evaluation:", error);
      throw error;
    }

    return data;
  }
};
