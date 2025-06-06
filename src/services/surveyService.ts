
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
  responses?: SurveyResponse[];
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  user_id: string;
  responses: any;
  submitted_at: string;
}

export const surveyService = {
  // Get active surveys with user's responses
  async getActiveSurveys(): Promise<Survey[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    // First get surveys
    const { data: surveys, error: surveysError } = await supabase
      .from('surveys')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (surveysError) {
      console.error("Error fetching surveys:", surveysError);
      throw surveysError;
    }

    // Then get user's responses for these surveys
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('user_id', user.id);

    if (responsesError) {
      console.error("Error fetching responses:", responsesError);
      throw responsesError;
    }

    // Combine surveys with responses
    const surveysWithResponses = surveys?.map(survey => ({
      ...survey,
      responses: responses?.filter(response => response.survey_id === survey.id) || []
    })) || [];

    return surveysWithResponses;
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
