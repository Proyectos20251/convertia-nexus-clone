
import { supabase } from "@/integrations/supabase/client";

export interface WellnessContent {
  id: string;
  title: string;
  content: string | null;
  content_type: string;
  url: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export const wellnessService = {
  // Get wellness content
  async getWellnessContent(): Promise<WellnessContent[]> {
    const { data, error } = await supabase
      .from('wellness_content')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching wellness content:", error);
      throw error;
    }

    return data || [];
  },

  // Create wellness content (admin only)
  async createContent(contentData: {
    title: string;
    content?: string;
    content_type?: string;
    url?: string;
    tags?: string[];
  }): Promise<WellnessContent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('wellness_content')
      .insert({
        created_by: user.id,
        ...contentData
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating wellness content:", error);
      throw error;
    }

    return data;
  }
};
