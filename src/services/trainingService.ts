
import { supabase } from "@/integrations/supabase/client";

export interface TrainingCourse {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_url: string | null;
  duration_hours: number | null;
  is_mandatory: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  enrollment?: CourseEnrollment;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  progress: number;
  completed_at: string | null;
  created_at: string;
}

export const trainingService = {
  // Get all courses
  async getCourses(): Promise<TrainingCourse[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('training_courses')
      .select(`
        *,
        enrollment:course_enrollments(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }

    return data || [];
  },

  // Enroll in course
  async enrollInCourse(courseId: string): Promise<CourseEnrollment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        course_id: courseId,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }

    return data;
  },

  // Update course progress
  async updateProgress(enrollmentId: string, progress: number): Promise<void> {
    const updateData: any = { progress };
    if (progress >= 100) {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('course_enrollments')
      .update(updateData)
      .eq('id', enrollmentId);

    if (error) {
      console.error("Error updating course progress:", error);
      throw error;
    }
  }
};
