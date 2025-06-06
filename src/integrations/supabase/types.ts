export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      absence_types: {
        Row: {
          color: string | null
          description: string | null
          id: string
          name: string
          requires_approval: boolean | null
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          name: string
          requires_approval?: boolean | null
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          name?: string
          requires_approval?: boolean | null
        }
        Relationships: []
      }
      absences: {
        Row: {
          comment: string | null
          created_at: string
          end_date: string
          half_day: boolean | null
          id: string
          start_date: string
          status: string | null
          type_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          end_date: string
          half_day?: boolean | null
          id?: string
          start_date: string
          status?: string | null
          type_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          end_date?: string
          half_day?: boolean | null
          id?: string
          start_date?: string
          status?: string | null
          type_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "absences_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "absence_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_history: {
        Row: {
          chat_type: string | null
          created_at: string
          id: string
          message: string
          response: string
          user_id: string
        }
        Insert: {
          chat_type?: string | null
          created_at?: string
          id?: string
          message: string
          response: string
          user_id: string
        }
        Update: {
          chat_type?: string | null
          created_at?: string
          id?: string
          message?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_limits: {
        Row: {
          created_at: string
          id: string
          requests_count: number | null
          usage_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          requests_count?: number | null
          usage_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          requests_count?: number | null
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          priority: string | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          priority?: string | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          priority?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      benefits: {
        Row: {
          benefit_type: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          link_url: string | null
          name: string
          value: string | null
        }
        Insert: {
          benefit_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          link_url?: string | null
          name: string
          value?: string | null
        }
        Update: {
          benefit_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          link_url?: string | null
          name?: string
          value?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          end_datetime: string
          event_type: string | null
          id: string
          location: string | null
          start_datetime: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          end_datetime: string
          event_type?: string | null
          id?: string
          location?: string | null
          start_datetime: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          end_datetime?: string
          event_type?: string | null
          id?: string
          location?: string | null
          start_datetime?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      competencies: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      competency_evaluations: {
        Row: {
          comments: string | null
          competency_id: string
          created_at: string
          evaluation_period: string | null
          evaluator_id: string
          id: string
          score: number | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          competency_id: string
          created_at?: string
          evaluation_period?: string | null
          evaluator_id: string
          id?: string
          score?: number | null
          user_id: string
        }
        Update: {
          comments?: string | null
          competency_id?: string
          created_at?: string
          evaluation_period?: string | null
          evaluator_id?: string
          id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competency_evaluations_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_type: string | null
          file_url: string | null
          id: string
          name: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_type?: string | null
          file_url?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string | null
          recipient_id: string | null
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          recipient_id?: string | null
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_employees: {
        Row: {
          created_at: string
          department: string | null
          email: string
          employment_type: string
          first_name: string
          id: string
          last_name: string
          position: string | null
          status: string
          team: string | null
          updated_at: string
          work_location: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          employment_type?: string
          first_name: string
          id?: string
          last_name: string
          position?: string | null
          status?: string
          team?: string | null
          updated_at?: string
          work_location: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          employment_type?: string
          first_name?: string
          id?: string
          last_name?: string
          position?: string | null
          status?: string
          team?: string | null
          updated_at?: string
          work_location?: string
        }
        Relationships: []
      }
      payroll: {
        Row: {
          basic_salary: number | null
          bonuses: number | null
          created_at: string
          deductions: number | null
          id: string
          period: string
          status: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          basic_salary?: number | null
          bonuses?: number | null
          created_at?: string
          deductions?: number | null
          id?: string
          period: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          basic_salary?: number | null
          bonuses?: number | null
          created_at?: string
          deductions?: number | null
          id?: string
          period?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_reviews: {
        Row: {
          comments: string | null
          created_at: string
          id: string
          period: string
          reviewer_id: string | null
          score: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: string
          period: string
          reviewer_id?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: string
          period?: string
          reviewer_id?: string | null
          score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          full_name: string | null
          id: string
          position: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id: string
          position?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string | null
          id?: string
          position?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          id: string
          responses: Json
          submitted_at: string
          survey_id: string
          user_id: string
        }
        Insert: {
          id?: string
          responses: Json
          submitted_at?: string
          survey_id: string
          user_id: string
        }
        Update: {
          id?: string
          responses?: Json
          submitted_at?: string
          survey_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          questions: Json
          target_groups: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          questions: Json
          target_groups?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          target_groups?: Json | null
          title?: string
        }
        Relationships: []
      }
      time_records: {
        Row: {
          check_in: string
          check_out: string | null
          created_at: string
          description: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in: string
          check_out?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string
          check_out?: string | null
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_courses: {
        Row: {
          content_type: string | null
          content_url: string | null
          created_at: string
          created_by: string
          description: string | null
          duration_hours: number | null
          id: string
          is_mandatory: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          content_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_mandatory?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          content_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          is_mandatory?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_benefits: {
        Row: {
          assigned_at: string
          benefit_id: string
          id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          benefit_id: string
          id?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          benefit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_benefits_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          can_assign_permissions: boolean
          can_edit_employees: boolean
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          can_assign_permissions?: boolean
          can_edit_employees?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          can_assign_permissions?: boolean
          can_edit_employees?: boolean
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      wellness_content: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          tags: string[] | null
          title: string
          url: string | null
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title: string
          url?: string | null
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          tags?: string[] | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      work_shifts: {
        Row: {
          break_duration: number | null
          created_at: string
          end_time: string
          id: string
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          shift_date: string
          start_time: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          break_duration?: number | null
          created_at?: string
          end_time: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          shift_date: string
          start_time: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          break_duration?: number | null
          created_at?: string
          end_time?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          shift_date?: string
          start_time?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "admin" | "manager" | "supervisor" | "collaborator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "manager", "supervisor", "collaborator"],
    },
  },
} as const
