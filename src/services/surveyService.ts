
import { supabase } from "@/integrations/supabase/client";

export interface Survey {
  id: string;
  title: string;
  description: string | null;
  questions: any;
  target_groups: any;
  is_active: boolean;
  created_by: string;
  created_at: string;
  expires_at: string | null;
  response?: SurveyResponse;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  user_id: string;
  responses: any;
  submitted_at: string;
}

export const surveyService = {
  // Get active surveys
  async getActiveSurveys(): Promise<Survey[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('surveys')
      .select(`
        *,
        response:survey_responses(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching surveys:", error);
      throw error;
    }

    return data || [];
  },

  // Submit survey response
  async submitResponse(surveyId: string, responses: any): Promise<SurveyResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        survey_id: surveyId,
        user_id: user.id,
        responses
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting survey response:", error);
      throw error;
    }

    return data;
  }
};
