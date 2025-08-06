export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          brand: string | null
          category: string
          created_at: string
          current_value: number | null
          description: string | null
          id: string
          location: string | null
          model: string | null
          name: string
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category: string
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          location?: string | null
          model?: string | null
          name: string
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string
          created_at?: string
          current_value?: number | null
          description?: string | null
          id?: string
          location?: string | null
          model?: string | null
          name?: string
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_benefits: {
        Row: {
          benefit_name: string
          benefit_type: string
          created_at: string
          details: Json | null
          employee_id: string | null
          enrollment_date: string | null
          id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          benefit_name: string
          benefit_type: string
          created_at?: string
          details?: Json | null
          employee_id?: string | null
          enrollment_date?: string | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          benefit_name?: string
          benefit_type?: string
          created_at?: string
          details?: Json | null
          employee_id?: string | null
          enrollment_date?: string | null
          id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_benefits_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_tasks: {
        Row: {
          actual_hours: number | null
          ai_complexity_score: number | null
          assigned_by: string | null
          auto_assigned: boolean | null
          completion_percentage: number | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          employee_id: string | null
          estimated_hours: number | null
          id: string
          priority: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          ai_complexity_score?: number | null
          assigned_by?: string | null
          auto_assigned?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          ai_complexity_score?: number | null
          assigned_by?: string | null
          auto_assigned?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_tasks_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_training: {
        Row: {
          certification_earned: boolean | null
          completion_percentage: number | null
          created_at: string
          employee_id: string | null
          end_date: string | null
          id: string
          provider: string | null
          start_date: string | null
          status: string | null
          training_name: string
          updated_at: string
        }
        Insert: {
          certification_earned?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          employee_id?: string | null
          end_date?: string | null
          id?: string
          provider?: string | null
          start_date?: string | null
          status?: string | null
          training_name: string
          updated_at?: string
        }
        Update: {
          certification_earned?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          employee_id?: string | null
          end_date?: string | null
          id?: string
          provider?: string | null
          start_date?: string | null
          status?: string | null
          training_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_training_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          bank_account: string | null
          contract_end_date: string | null
          created_at: string
          department: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          employment_status: string | null
          employment_type: string | null
          hire_date: string | null
          id: string
          position: string
          probation_end_date: string | null
          salary: number | null
          tax_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bank_account?: string | null
          contract_end_date?: string | null
          created_at?: string
          department: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          employment_status?: string | null
          employment_type?: string | null
          hire_date?: string | null
          id?: string
          position: string
          probation_end_date?: string | null
          salary?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bank_account?: string | null
          contract_end_date?: string | null
          created_at?: string
          department?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          employment_status?: string | null
          employment_type?: string | null
          hire_date?: string | null
          id?: string
          position?: string
          probation_end_date?: string | null
          salary?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          application_status: string | null
          applied_date: string | null
          cover_letter: string | null
          created_at: string
          id: string
          job_posting_id: string | null
          resume_url: string | null
          updated_at: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          application_status?: string | null
          applied_date?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_posting_id?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          application_status?: string | null
          applied_date?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_posting_id?: string | null
          resume_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          company: string
          created_at: string
          description: string | null
          employment_type: string | null
          id: string
          location: string
          posted_date: string | null
          requirements: string | null
          salary_range: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          company: string
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location: string
          posted_date?: string | null
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          company?: string
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string
          posted_date?: string | null
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          created_at: string
          employee_id: string | null
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      livelihood_programs: {
        Row: {
          budget: number | null
          created_at: string
          duration_months: number | null
          end_date: string | null
          expected_outcomes: string | null
          focus_area: string
          id: string
          max_participants: number | null
          program_name: string
          start_date: string | null
          status: string | null
          target_demographic: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          duration_months?: number | null
          end_date?: string | null
          expected_outcomes?: string | null
          focus_area: string
          id?: string
          max_participants?: number | null
          program_name: string
          start_date?: string | null
          status?: string | null
          target_demographic?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          duration_months?: number | null
          end_date?: string | null
          expected_outcomes?: string | null
          focus_area?: string
          id?: string
          max_participants?: number | null
          program_name?: string
          start_date?: string | null
          status?: string | null
          target_demographic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      local_products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          price: number | null
          producer_contact: string | null
          producer_name: string
          product_name: string
          status: string | null
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          producer_contact?: string | null
          producer_name: string
          product_name: string
          status?: string | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          price?: number | null
          producer_contact?: string | null
          producer_name?: string
          product_name?: string
          status?: string | null
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payroll_entries: {
        Row: {
          base_salary: number | null
          bonuses: number | null
          created_at: string
          deductions: number | null
          employee_id: string | null
          id: string
          net_pay: number | null
          overtime_pay: number | null
          period_end: string
          period_start: string
          status: string | null
          updated_at: string
        }
        Insert: {
          base_salary?: number | null
          bonuses?: number | null
          created_at?: string
          deductions?: number | null
          employee_id?: string | null
          id?: string
          net_pay?: number | null
          overtime_pay?: number | null
          period_end: string
          period_start: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          base_salary?: number | null
          bonuses?: number | null
          created_at?: string
          deductions?: number | null
          employee_id?: string | null
          id?: string
          net_pay?: number | null
          overtime_pay?: number | null
          period_end?: string
          period_start?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          achievements: string | null
          areas_for_improvement: string | null
          created_at: string
          employee_id: string | null
          goals: string | null
          id: string
          overall_rating: number | null
          period_end: string
          period_start: string
          reviewer_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          areas_for_improvement?: string | null
          created_at?: string
          employee_id?: string | null
          goals?: string | null
          id?: string
          overall_rating?: number | null
          period_end: string
          period_start: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          areas_for_improvement?: string | null
          created_at?: string
          employee_id?: string | null
          goals?: string | null
          id?: string
          overall_rating?: number | null
          period_end?: string
          period_start?: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startup_applications: {
        Row: {
          application_status: string | null
          business_idea: string
          business_name: string
          created_at: string
          funding_required: number
          id: string
          industry: string
          notes: string | null
          submitted_date: string | null
          team_size: number
          updated_at: string
        }
        Insert: {
          application_status?: string | null
          business_idea: string
          business_name: string
          created_at?: string
          funding_required: number
          id?: string
          industry: string
          notes?: string | null
          submitted_date?: string | null
          team_size: number
          updated_at?: string
        }
        Update: {
          application_status?: string | null
          business_idea?: string
          business_name?: string
          created_at?: string
          funding_required?: number
          id?: string
          industry?: string
          notes?: string | null
          submitted_date?: string | null
          team_size?: number
          updated_at?: string
        }
        Relationships: []
      }
      stock_items: {
        Row: {
          category: string
          created_at: string
          id: string
          item_name: string
          location: string | null
          quantity: number
          reorder_level: number | null
          status: string | null
          supplier: string | null
          unit: string | null
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          item_name: string
          location?: string | null
          quantity?: number
          reorder_level?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          item_name?: string
          location?: string | null
          quantity?: number
          reorder_level?: number | null
          status?: string | null
          supplier?: string | null
          unit?: string | null
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
