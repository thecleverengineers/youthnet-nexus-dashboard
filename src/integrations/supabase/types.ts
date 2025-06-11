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
      attendance_records: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string
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
      certifications: {
        Row: {
          created_at: string
          credential_id: string | null
          expected_completion: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string
          name: string
          progress: number
          skills: string[] | null
          status: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          expected_completion?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer: string
          name: string
          progress?: number
          skills?: string[] | null
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          expected_completion?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string
          name?: string
          progress?: number
          skills?: string[] | null
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          assigned_by: string | null
          assignment_reason: string | null
          completion_date: string | null
          course_id: string | null
          created_at: string
          enrollment_date: string
          grade: string | null
          id: string
          status: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assignment_reason?: string | null
          completion_date?: string | null
          course_id?: string | null
          created_at?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assignment_reason?: string | null
          completion_date?: string | null
          course_id?: string | null
          created_at?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          status?: string
          student_id?: string | null
          updated_at?: string
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
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      education_courses: {
        Row: {
          course_code: string
          course_name: string
          created_at: string
          credits: number | null
          department: string | null
          description: string | null
          duration_months: number
          id: string
          instructor_id: string | null
          max_students: number | null
          prerequisites: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          duration_months: number
          id?: string
          instructor_id?: string | null
          max_students?: number | null
          prerequisites?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          duration_months?: number
          id?: string
          instructor_id?: string | null
          max_students?: number | null
          prerequisites?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          employee_id: string
          employment_status: string
          hire_date: string
          id: string
          manager_id: string | null
          position: string
          salary: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department: string
          employee_id: string
          employment_status?: string
          hire_date: string
          id?: string
          manager_id?: string | null
          position: string
          salary?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string
          employee_id?: string
          employment_status?: string
          hire_date?: string
          id?: string
          manager_id?: string | null
          position?: string
          salary?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      incubation_projects: {
        Row: {
          created_at: string
          description: string | null
          expected_completion: string | null
          founder_id: string | null
          funding_amount: number | null
          id: string
          mentor_id: string | null
          name: string
          start_date: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expected_completion?: string | null
          founder_id?: string | null
          funding_amount?: number | null
          id?: string
          mentor_id?: string | null
          name: string
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expected_completion?: string | null
          founder_id?: string | null
          funding_amount?: number | null
          id?: string
          mentor_id?: string | null
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incubation_projects_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incubation_projects_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          assigned_to: string | null
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
          status: Database["public"]["Enums"]["inventory_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
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
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
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
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          application_date: string
          created_at: string
          id: string
          interview_date: string | null
          job_id: string | null
          notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string | null
          updated_at: string
        }
        Insert: {
          application_date?: string
          created_at?: string
          id?: string
          interview_date?: string | null
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          application_date?: string
          created_at?: string
          id?: string
          interview_date?: string | null
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          closing_date: string | null
          company: string
          created_at: string
          description: string | null
          id: string
          job_type: string | null
          location: string | null
          posted_by: string | null
          posted_date: string
          requirements: string | null
          salary_range: string | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
        }
        Insert: {
          closing_date?: string | null
          company: string
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          posted_date?: string
          requirements?: string | null
          salary_range?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
        }
        Update: {
          closing_date?: string | null
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          posted_date?: string
          requirements?: string | null
          salary_range?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      livelihood_programs: {
        Row: {
          budget: number | null
          coordinator_id: string | null
          created_at: string
          duration_weeks: number | null
          expected_outcomes: string[] | null
          focus_area: string
          id: string
          max_participants: number | null
          program_name: string
          program_status: string
          target_demographic: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          coordinator_id?: string | null
          created_at?: string
          duration_weeks?: number | null
          expected_outcomes?: string[] | null
          focus_area: string
          id?: string
          max_participants?: number | null
          program_name: string
          program_status?: string
          target_demographic?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          coordinator_id?: string | null
          created_at?: string
          duration_weeks?: number | null
          expected_outcomes?: string[] | null
          focus_area?: string
          id?: string
          max_participants?: number | null
          program_name?: string
          program_status?: string
          target_demographic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      local_products: {
        Row: {
          category: string
          certification_status: string | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          price: number | null
          producer_contact: string | null
          producer_name: string
          product_name: string
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          category: string
          certification_status?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          price?: number | null
          producer_contact?: string | null
          producer_name: string
          product_name: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          certification_status?: string | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          price?: number | null
          producer_contact?: string | null
          producer_name?: string
          product_name?: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          data: Json | null
          department: string | null
          file_url: string | null
          generated_at: string
          generated_by: string | null
          id: string
          period_end: string | null
          period_start: string | null
          title: string
          type: string
        }
        Insert: {
          data?: Json | null
          department?: string | null
          file_url?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          title: string
          type: string
        }
        Update: {
          data?: Json | null
          department?: string | null
          file_url?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          created_at: string
          id: string
          last_assessed: string | null
          level: string
          next_assessment: string | null
          progress: number
          skill_name: string
          status: string
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_assessed?: string | null
          level: string
          next_assessment?: string | null
          progress?: number
          skill_name: string
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_assessed?: string | null
          level?: string
          next_assessment?: string | null
          progress?: number
          skill_name?: string
          status?: string
          student_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_applications: {
        Row: {
          applicant_id: string | null
          application_status: string
          business_idea: string
          business_name: string
          created_at: string
          funding_required: number | null
          id: string
          industry: string | null
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_at: string
          team_size: number | null
          updated_at: string
        }
        Insert: {
          applicant_id?: string | null
          application_status?: string
          business_idea: string
          business_name: string
          created_at?: string
          funding_required?: number | null
          id?: string
          industry?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string
          team_size?: number | null
          updated_at?: string
        }
        Update: {
          applicant_id?: string | null
          application_status?: string
          business_idea?: string
          business_name?: string
          created_at?: string
          funding_required?: number | null
          id?: string
          industry?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string
          team_size?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      student_enrollments: {
        Row: {
          completion_date: string | null
          created_at: string
          enrollment_date: string
          grade: string | null
          id: string
          program_id: string | null
          status: Database["public"]["Enums"]["training_status"]
          student_id: string | null
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          program_id?: string | null
          status?: Database["public"]["Enums"]["training_status"]
          student_id?: string | null
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          program_id?: string | null
          status?: Database["public"]["Enums"]["training_status"]
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          date_of_birth: string | null
          education_level: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          enrollment_date: string
          gender: string | null
          id: string
          status: Database["public"]["Enums"]["training_status"]
          student_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string
          gender?: string | null
          id?: string
          status?: Database["public"]["Enums"]["training_status"]
          student_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string
          gender?: string | null
          id?: string
          status?: Database["public"]["Enums"]["training_status"]
          student_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          created_at: string
          experience_years: number | null
          hire_date: string
          id: string
          qualification: string | null
          specialization: string
          status: string
          trainer_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          hire_date?: string
          id?: string
          qualification?: string | null
          specialization: string
          status?: string
          trainer_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          hire_date?: string
          id?: string
          qualification?: string | null
          specialization?: string
          status?: string
          trainer_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          created_at: string
          description: string | null
          duration_weeks: number
          end_date: string | null
          id: string
          max_participants: number | null
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["training_status"]
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks: number
          end_date?: string | null
          id?: string
          max_participants?: number | null
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["training_status"]
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          end_date?: string | null
          id?: string
          max_participants?: number | null
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["training_status"]
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_programs_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      application_status:
        | "pending"
        | "shortlisted"
        | "interviewed"
        | "selected"
        | "rejected"
      inventory_status:
        | "available"
        | "in_use"
        | "maintenance"
        | "damaged"
        | "disposed"
      job_status: "open" | "closed" | "filled"
      project_status:
        | "idea"
        | "development"
        | "testing"
        | "launched"
        | "suspended"
      training_status: "pending" | "active" | "completed" | "dropped"
      user_role: "admin" | "staff" | "trainer" | "student"
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
      application_status: [
        "pending",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
      ],
      inventory_status: [
        "available",
        "in_use",
        "maintenance",
        "damaged",
        "disposed",
      ],
      job_status: ["open", "closed", "filled"],
      project_status: [
        "idea",
        "development",
        "testing",
        "launched",
        "suspended",
      ],
      training_status: ["pending", "active", "completed", "dropped"],
      user_role: ["admin", "staff", "trainer", "student"],
    },
  },
} as const
