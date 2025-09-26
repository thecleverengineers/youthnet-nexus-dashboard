export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          assignment_reason: string | null
          completed_at: string | null
          course_id: string
          created_at: string | null
          enrollment_date: string | null
          grade: string | null
          id: string
          status: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          assignment_reason?: string | null
          completed_at?: string | null
          course_id: string
          created_at?: string | null
          enrollment_date?: string | null
          grade?: string | null
          id?: string
          status?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          assignment_reason?: string | null
          completed_at?: string | null
          course_id?: string
          created_at?: string | null
          enrollment_date?: string | null
          grade?: string | null
          id?: string
          status?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "education_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      education_courses: {
        Row: {
          course_code: string
          course_name: string
          created_at: string | null
          credits: number | null
          department: string | null
          description: string | null
          duration_weeks: number | null
          id: string
          max_students: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string | null
          credits?: number | null
          department?: string | null
          description?: string | null
          duration_weeks?: number | null
          id?: string
          max_students?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string | null
          credits?: number | null
          department?: string | null
          description?: string | null
          duration_weeks?: number | null
          id?: string
          max_students?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_id: string | null
          variables_used: Json | null
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_id?: string | null
          variables_used?: Json | null
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_id?: string | null
          variables_used?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string
          id: string
          name: string
          status: string | null
          subject: string
          text_content: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          html_content: string
          id?: string
          name: string
          status?: string | null
          subject: string
          text_content?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          html_content?: string
          id?: string
          name?: string
          status?: string | null
          subject?: string
          text_content?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          bank_account: string | null
          contract_end_date: string | null
          created_at: string | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          employment_status: string | null
          employment_type: string | null
          full_name: string
          hire_date: string | null
          id: string
          phone: string | null
          position: string | null
          probation_end_date: string | null
          salary: number | null
          salary_annual: number | null
          status: Database["public"]["Enums"]["user_status"] | null
          tax_id: string | null
          type: Database["public"]["Enums"]["employee_type"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          bank_account?: string | null
          contract_end_date?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          employment_status?: string | null
          employment_type?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          probation_end_date?: string | null
          salary?: number | null
          salary_annual?: number | null
          status?: Database["public"]["Enums"]["user_status"] | null
          tax_id?: string | null
          type?: Database["public"]["Enums"]["employee_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          bank_account?: string | null
          contract_end_date?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          employment_status?: string | null
          employment_type?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          position?: string | null
          probation_end_date?: string | null
          salary?: number | null
          salary_annual?: number | null
          status?: Database["public"]["Enums"]["user_status"] | null
          tax_id?: string | null
          type?: Database["public"]["Enums"]["employee_type"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      export_logs: {
        Row: {
          created_at: string | null
          created_by: string | null
          export_format: string
          export_type: string
          file_path: string | null
          id: string
          record_count: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          export_format: string
          export_type: string
          file_path?: string | null
          id?: string
          record_count?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          export_format?: string
          export_type?: string
          file_path?: string | null
          id?: string
          record_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "export_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          priority: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          priority?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          token: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          token?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          token?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted_by: string | null
          id: string
          permission: string
          resource: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          permission: string
          resource?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: string
          resource?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { check_user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      employee_type: "full_time" | "part_time" | "contract" | "intern"
      user_role: "admin" | "staff" | "student" | "trainer"
      user_status: "active" | "inactive" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employee_type: ["full_time", "part_time", "contract", "intern"],
      user_role: ["admin", "staff", "student", "trainer"],
      user_status: ["active", "inactive", "suspended"],
    },
  },
} as const
