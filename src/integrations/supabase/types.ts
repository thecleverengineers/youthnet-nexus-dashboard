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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics_cache: {
        Row: {
          cache_key: string
          created_at: string
          data: Json
          expires_at: string
          id: string
          updated_at: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          data: Json
          expires_at: string
          id?: string
          updated_at?: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          data?: Json
          expires_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      analytics_dashboards: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_refreshed: string | null
          name: string
          refresh_interval: number | null
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_refreshed?: string | null
          name: string
          refresh_interval?: number | null
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_refreshed?: string | null
          name?: string
          refresh_interval?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_dashboards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_reports: {
        Row: {
          data_source: string[] | null
          file_url: string | null
          filters: Json | null
          generated_at: string
          generated_by: string | null
          id: string
          report_data: Json | null
          report_name: string
          report_type: string
          status: string | null
        }
        Insert: {
          data_source?: string[] | null
          file_url?: string | null
          filters?: Json | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          report_data?: Json | null
          report_name: string
          report_type: string
          status?: string | null
        }
        Update: {
          data_source?: string[] | null
          file_url?: string | null
          filters?: Json | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          report_data?: Json | null
          report_name?: string
          report_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artisans: {
        Row: {
          address: string | null
          bank_account_details: Json | null
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          craft_specialization: string[] | null
          created_at: string
          district: string | null
          experience_years: number | null
          id: string
          id_proof_number: string | null
          id_proof_type: string | null
          name: string
          profile_image_url: string | null
          registration_number: string | null
          social_media_links: Json | null
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          address?: string | null
          bank_account_details?: Json | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          craft_specialization?: string[] | null
          created_at?: string
          district?: string | null
          experience_years?: number | null
          id?: string
          id_proof_number?: string | null
          id_proof_type?: string | null
          name: string
          profile_image_url?: string | null
          registration_number?: string | null
          social_media_links?: Json | null
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          address?: string | null
          bank_account_details?: Json | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          craft_specialization?: string[] | null
          created_at?: string
          district?: string | null
          experience_years?: number | null
          id?: string
          id_proof_number?: string | null
          id_proof_type?: string | null
          name?: string
          profile_image_url?: string | null
          registration_number?: string | null
          social_media_links?: Json | null
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
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
      attendance_tracking: {
        Row: {
          approved_by: string | null
          break_end: string | null
          break_start: string | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          date: string
          employee_id: string | null
          id: string
          ip_address: string | null
          location: string | null
          notes: string | null
          overtime_hours: number | null
          status: string | null
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          break_end?: string | null
          break_start?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          break_end?: string | null
          break_start?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          date?: string
          employee_id?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_tracking_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_tracking_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      career_counseling_sessions: {
        Row: {
          counselor_id: string | null
          created_at: string
          duration_minutes: number | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          notes: string | null
          recommendations: string | null
          session_date: string
          session_type: string | null
          status: string | null
          student_id: string | null
          topics_discussed: string[] | null
          updated_at: string
        }
        Insert: {
          counselor_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          recommendations?: string | null
          session_date: string
          session_type?: string | null
          status?: string | null
          student_id?: string | null
          topics_discussed?: string[] | null
          updated_at?: string
        }
        Update: {
          counselor_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          notes?: string | null
          recommendations?: string | null
          session_date?: string
          session_type?: string | null
          status?: string | null
          student_id?: string | null
          topics_discussed?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_counseling_sessions_counselor_id_fkey"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_counseling_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string | null
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
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
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
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
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
          updated_at?: string | null
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
      community_metrics: {
        Row: {
          baseline_value: number | null
          beneficiaries_count: number | null
          created_at: string
          current_value: number
          id: string
          location: string | null
          measurement_date: string
          metric_name: string
          metric_type: string
          program_id: string | null
          target_value: number | null
          updated_at: string
        }
        Insert: {
          baseline_value?: number | null
          beneficiaries_count?: number | null
          created_at?: string
          current_value: number
          id?: string
          location?: string | null
          measurement_date: string
          metric_name: string
          metric_type: string
          program_id?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Update: {
          baseline_value?: number | null
          beneficiaries_count?: number | null
          created_at?: string
          current_value?: number
          id?: string
          location?: string | null
          measurement_date?: string
          metric_name?: string
          metric_type?: string
          program_id?: string | null
          target_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_metrics_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "livelihood_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          assignment_reason: string | null
          course_id: string
          created_at: string
          enrollment_date: string
          id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assignment_reason?: string | null
          course_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assignment_reason?: string | null
          course_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id?: string
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
      dynamic_roles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system_role: boolean | null
          role_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          role_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_role?: boolean | null
          role_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dynamic_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      education_analytics: {
        Row: {
          created_at: string
          department_id: string
          id: string
          metric_name: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          metric_name: string
          metric_type?: string
          metric_value: number
          period_end: string
          period_start: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          updated_at?: string
        }
        Relationships: []
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
          max_students: number | null
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
          duration_months?: number
          id?: string
          max_students?: number | null
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
          max_students?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_benefits: {
        Row: {
          benefit_name: string
          benefit_type: string
          coverage_amount: number | null
          created_at: string | null
          employee_contribution: number | null
          employee_id: string | null
          end_date: string | null
          id: string
          premium_amount: number | null
          provider: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          benefit_name: string
          benefit_type: string
          coverage_amount?: number | null
          created_at?: string | null
          employee_contribution?: number | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          premium_amount?: number | null
          provider?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          benefit_name?: string
          benefit_type?: string
          coverage_amount?: number | null
          created_at?: string | null
          employee_contribution?: number | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          premium_amount?: number | null
          provider?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
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
          assigned_to: string
          attachments: Json | null
          auto_assigned: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          ai_complexity_score?: number | null
          assigned_by?: string | null
          assigned_to: string
          attachments?: Json | null
          auto_assigned?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          ai_complexity_score?: number | null
          assigned_by?: string | null
          assigned_to?: string
          attachments?: Json | null
          auto_assigned?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
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
            foreignKeyName: "employee_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_training: {
        Row: {
          certification_earned: string | null
          completion_date: string | null
          cost: number | null
          created_at: string | null
          employee_id: string | null
          end_date: string | null
          id: string
          notes: string | null
          provider: string | null
          start_date: string | null
          status: string | null
          training_name: string
          training_type: string
          updated_at: string | null
        }
        Insert: {
          certification_earned?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          provider?: string | null
          start_date?: string | null
          status?: string | null
          training_name: string
          training_type: string
          updated_at?: string | null
        }
        Update: {
          certification_earned?: string | null
          completion_date?: string | null
          cost?: number | null
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          provider?: string | null
          start_date?: string | null
          status?: string | null
          training_name?: string
          training_type?: string
          updated_at?: string | null
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
          date_of_joining: string | null
          department: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          gender: string | null
          hire_date: string | null
          id: string
          join_date: string | null
          manager_id: string | null
          position: string | null
          probation_end_date: string | null
          salary: number | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_account?: string | null
          contract_end_date?: string | null
          created_at?: string
          date_of_joining?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          gender?: string | null
          hire_date?: string | null
          id?: string
          join_date?: string | null
          manager_id?: string | null
          position?: string | null
          probation_end_date?: string | null
          salary?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_account?: string | null
          contract_end_date?: string | null
          created_at?: string
          date_of_joining?: string | null
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          gender?: string | null
          hire_date?: string | null
          id?: string
          join_date?: string | null
          manager_id?: string | null
          position?: string | null
          probation_end_date?: string | null
          salary?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_partnerships: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          industry: string | null
          location: string | null
          partnership_end_date: string | null
          partnership_start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          partnership_end_date?: string | null
          partnership_start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          location?: string | null
          partnership_end_date?: string | null
          partnership_start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      export_requests: {
        Row: {
          completed_at: string | null
          data_source: string
          export_type: string
          file_url: string | null
          filters: Json | null
          format: string | null
          id: string
          requested_at: string
          requested_by: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          data_source: string
          export_type: string
          file_url?: string | null
          filters?: Json | null
          format?: string | null
          id?: string
          requested_at?: string
          requested_by?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          data_source?: string
          export_type?: string
          file_url?: string | null
          filters?: Json | null
          format?: string | null
          id?: string
          requested_at?: string
          requested_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_applications: {
        Row: {
          amount_approved: number | null
          amount_requested: number
          application_date: string | null
          created_at: string
          decision_date: string | null
          disbursement_date: string | null
          funding_type: string
          id: string
          notes: string | null
          purpose: string
          reviewed_by: string | null
          startup_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount_approved?: number | null
          amount_requested: number
          application_date?: string | null
          created_at?: string
          decision_date?: string | null
          disbursement_date?: string | null
          funding_type: string
          id?: string
          notes?: string | null
          purpose: string
          reviewed_by?: string | null
          startup_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount_approved?: number | null
          amount_requested?: number
          application_date?: string | null
          created_at?: string
          decision_date?: string | null
          disbursement_date?: string | null
          funding_type?: string
          id?: string
          notes?: string | null
          purpose?: string
          reviewed_by?: string | null
          startup_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "funding_applications_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startup_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      incubation_program_details: {
        Row: {
          coordinator_id: string | null
          created_at: string
          description: string | null
          duration_months: number
          end_date: string | null
          id: string
          max_participants: number | null
          modules: string[] | null
          program_name: string
          requirements: string[] | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          coordinator_id?: string | null
          created_at?: string
          description?: string | null
          duration_months: number
          end_date?: string | null
          id?: string
          max_participants?: number | null
          modules?: string[] | null
          program_name: string
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          coordinator_id?: string | null
          created_at?: string
          description?: string | null
          duration_months?: number
          end_date?: string | null
          id?: string
          max_participants?: number | null
          modules?: string[] | null
          program_name?: string
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incubation_program_details_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incubation_projects: {
        Row: {
          created_at: string | null
          description: string | null
          expected_completion: string | null
          founder_id: string | null
          funding_amount: number | null
          id: string
          mentor_id: string | null
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expected_completion?: string | null
          founder_id?: string | null
          funding_amount?: number | null
          id?: string
          mentor_id?: string | null
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expected_completion?: string | null
          founder_id?: string | null
          funding_amount?: number | null
          id?: string
          mentor_id?: string | null
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
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
      instructors: {
        Row: {
          created_at: string
          experience_years: number | null
          hire_date: string | null
          id: string
          instructor_id: string
          qualification: string
          salary: number | null
          specialization: string[] | null
          status: string | null
          subjects: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          hire_date?: string | null
          id?: string
          instructor_id: string
          qualification: string
          salary?: number | null
          specialization?: string[] | null
          status?: string | null
          subjects?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          hire_date?: string | null
          id?: string
          instructor_id?: string
          qualification?: string
          salary?: number | null
          specialization?: string[] | null
          status?: string | null
          subjects?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instructors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_categories: {
        Row: {
          category_name: string
          created_at: string
          depreciation_rate: number | null
          description: string | null
          id: string
          is_active: boolean | null
          maintenance_frequency_days: number | null
          parent_category_id: string | null
          updated_at: string
        }
        Insert: {
          category_name: string
          created_at?: string
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          maintenance_frequency_days?: number | null
          parent_category_id?: string | null
          updated_at?: string
        }
        Update: {
          category_name?: string
          created_at?: string
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          maintenance_frequency_days?: number | null
          parent_category_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          assigned_to: string | null
          brand: string | null
          category: string
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          location: string | null
          model: string | null
          name: string
          purchase_date: string | null
          purchase_price: number | null
          serial_number: string | null
          status: Database["public"]["Enums"]["inventory_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          brand?: string | null
          category: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          location?: string | null
          model?: string | null
          name: string
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          brand?: string | null
          category?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          location?: string | null
          model?: string | null
          name?: string
          purchase_date?: string | null
          purchase_price?: number | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["inventory_status"] | null
          updated_at?: string | null
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
      inventory_stock: {
        Row: {
          current_stock: number
          id: string
          item_id: string | null
          last_restocked_date: string | null
          last_updated: string
          location_id: string | null
          maximum_capacity: number | null
          minimum_threshold: number
          notes: string | null
        }
        Insert: {
          current_stock?: number
          id?: string
          item_id?: string | null
          last_restocked_date?: string | null
          last_updated?: string
          location_id?: string | null
          maximum_capacity?: number | null
          minimum_threshold?: number
          notes?: string | null
        }
        Update: {
          current_stock?: number
          id?: string
          item_id?: string | null
          last_restocked_date?: string | null
          last_updated?: string
          location_id?: string | null
          maximum_capacity?: number | null
          minimum_threshold?: number
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_stock_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          application_date: string | null
          created_at: string | null
          id: string
          interview_date: string | null
          job_id: string | null
          notes: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          created_at?: string | null
          id?: string
          interview_date?: string | null
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          created_at?: string | null
          id?: string
          interview_date?: string | null
          job_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string | null
          updated_at?: string | null
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
          created_at: string | null
          description: string | null
          id: string
          job_type: string | null
          location: string | null
          posted_by: string | null
          posted_date: string | null
          requirements: string | null
          salary_range: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          closing_date?: string | null
          company: string
          created_at?: string | null
          description?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          posted_date?: string | null
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          closing_date?: string | null
          company?: string
          created_at?: string | null
          description?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          posted_date?: string | null
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
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
      landing_page_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: Json
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          comments: string | null
          created_at: string | null
          days_requested: number
          employee_id: string | null
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          comments?: string | null
          created_at?: string | null
          days_requested: number
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          comments?: string | null
          created_at?: string | null
          days_requested?: number
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
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
          coordinator_id: string | null
          created_at: string | null
          duration_weeks: number | null
          expected_outcomes: string[] | null
          focus_area: string
          id: string
          max_participants: number | null
          program_name: string
          program_status: string | null
          target_demographic: string | null
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          coordinator_id?: string | null
          created_at?: string | null
          duration_weeks?: number | null
          expected_outcomes?: string[] | null
          focus_area: string
          id?: string
          max_participants?: number | null
          program_name: string
          program_status?: string | null
          target_demographic?: string | null
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          coordinator_id?: string | null
          created_at?: string | null
          duration_weeks?: number | null
          expected_outcomes?: string[] | null
          focus_area?: string
          id?: string
          max_participants?: number | null
          program_name?: string
          program_status?: string | null
          target_demographic?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      local_products: {
        Row: {
          category: string
          certification_status: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          price: number | null
          producer_contact: string | null
          producer_name: string
          product_name: string
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          certification_status?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          price?: number | null
          producer_contact?: string | null
          producer_name: string
          product_name: string
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          certification_status?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          price?: number | null
          producer_contact?: string | null
          producer_name?: string
          product_name?: string
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      maintenance_schedules: {
        Row: {
          asset_id: string | null
          assigned_to: string | null
          cost_estimate: number | null
          created_at: string
          estimated_duration: number | null
          frequency: string
          id: string
          next_due_date: string
          priority: string | null
          status: string | null
          task_description: string | null
          task_name: string
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          assigned_to?: string | null
          cost_estimate?: number | null
          created_at?: string
          estimated_duration?: number | null
          frequency: string
          id?: string
          next_due_date: string
          priority?: string | null
          status?: string | null
          task_description?: string | null
          task_name: string
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          assigned_to?: string | null
          cost_estimate?: number | null
          created_at?: string
          estimated_duration?: number | null
          frequency?: string
          id?: string
          next_due_date?: string
          priority?: string | null
          status?: string | null
          task_description?: string | null
          task_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_metrics: {
        Row: {
          average_order_value: number | null
          created_at: string
          id: string
          metric_date: string
          revenue_by_region: Json | null
          top_categories: string[] | null
          total_orders: number | null
          total_sales: number | null
          unique_buyers: number | null
          updated_at: string
        }
        Insert: {
          average_order_value?: number | null
          created_at?: string
          id?: string
          metric_date: string
          revenue_by_region?: Json | null
          top_categories?: string[] | null
          total_orders?: number | null
          total_sales?: number | null
          unique_buyers?: number | null
          updated_at?: string
        }
        Update: {
          average_order_value?: number | null
          created_at?: string
          id?: string
          metric_date?: string
          revenue_by_region?: Json | null
          top_categories?: string[] | null
          total_orders?: number | null
          total_sales?: number | null
          unique_buyers?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      mentor_assignments: {
        Row: {
          assignment_date: string | null
          created_at: string
          end_date: string | null
          entrepreneur_id: string | null
          goals: string[] | null
          id: string
          incubation_project_id: string | null
          meeting_frequency: string | null
          mentor_id: string | null
          progress_notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assignment_date?: string | null
          created_at?: string
          end_date?: string | null
          entrepreneur_id?: string | null
          goals?: string[] | null
          id?: string
          incubation_project_id?: string | null
          meeting_frequency?: string | null
          mentor_id?: string | null
          progress_notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assignment_date?: string | null
          created_at?: string
          end_date?: string | null
          entrepreneur_id?: string | null
          goals?: string[] | null
          id?: string
          incubation_project_id?: string | null
          meeting_frequency?: string | null
          mentor_id?: string | null
          progress_notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_assignments_entrepreneur_id_fkey"
            columns: ["entrepreneur_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_assignments_incubation_project_id_fkey"
            columns: ["incubation_project_id"]
            isOneToOne: false
            referencedRelation: "incubation_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_assignments_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability_schedule: Json | null
          bio: string | null
          company_affiliation: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          current_mentees: number | null
          expertise_areas: string[] | null
          hourly_rate: number | null
          id: string
          industry_experience: number | null
          linkedin_profile: string | null
          mentorship_capacity: number | null
          name: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          bio?: string | null
          company_affiliation?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_mentees?: number | null
          expertise_areas?: string[] | null
          hourly_rate?: number | null
          id?: string
          industry_experience?: number | null
          linkedin_profile?: string | null
          mentorship_capacity?: number | null
          name: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          bio?: string | null
          company_affiliation?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          current_mentees?: number | null
          expertise_areas?: string[] | null
          hourly_rate?: number | null
          id?: string
          industry_experience?: number | null
          linkedin_profile?: string | null
          mentorship_capacity?: number | null
          name?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          action_items: string[] | null
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          session_date: string
          session_type: string | null
          status: string | null
          topics_discussed: string[] | null
          updated_at: string
        }
        Insert: {
          action_items?: string[] | null
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          session_date: string
          session_type?: string | null
          status?: string | null
          topics_discussed?: string[] | null
          updated_at?: string
        }
        Update: {
          action_items?: string[] | null
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          session_date?: string
          session_type?: string | null
          status?: string | null
          topics_discussed?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          delivery_method: string[]
          id: string
          is_enabled: boolean
          notification_type: string
          setting_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_method?: string[]
          id?: string
          is_enabled?: boolean
          notification_type: string
          setting_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_method?: string[]
          id?: string
          is_enabled?: boolean
          notification_type?: string
          setting_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          read_at: string | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          read_at?: string | null
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      outcome_assessments: {
        Row: {
          assessment_date: string
          assessment_type: string
          assessor_id: string | null
          challenges: string[] | null
          created_at: string
          id: string
          improvements: string[] | null
          participant_id: string | null
          program_id: string | null
          recommendations: string | null
          scores: Json | null
          updated_at: string
        }
        Insert: {
          assessment_date: string
          assessment_type: string
          assessor_id?: string | null
          challenges?: string[] | null
          created_at?: string
          id?: string
          improvements?: string[] | null
          participant_id?: string | null
          program_id?: string | null
          recommendations?: string | null
          scores?: Json | null
          updated_at?: string
        }
        Update: {
          assessment_date?: string
          assessment_type?: string
          assessor_id?: string | null
          challenges?: string[] | null
          created_at?: string
          id?: string
          improvements?: string[] | null
          participant_id?: string | null
          program_id?: string | null
          recommendations?: string | null
          scores?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outcome_assessments_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcome_assessments_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outcome_assessments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "livelihood_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_progress: {
        Row: {
          completion_percentage: number | null
          created_at: string
          id: string
          milestone_date: string | null
          milestone_name: string
          notes: string | null
          participant_id: string | null
          program_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          id?: string
          milestone_date?: string | null
          milestone_name: string
          notes?: string | null
          participant_id?: string | null
          program_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          id?: string
          milestone_date?: string | null
          milestone_name?: string
          notes?: string | null
          participant_id?: string | null
          program_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participant_progress_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_progress_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "livelihood_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          ai_risk_score: number | null
          created_at: string
          deductions: number
          employee_id: string
          gross_pay: number
          id: string
          net_pay: number
          payroll_cycle_id: string
          updated_at: string
        }
        Insert: {
          ai_risk_score?: number | null
          created_at?: string
          deductions?: number
          employee_id: string
          gross_pay?: number
          id?: string
          net_pay?: number
          payroll_cycle_id: string
          updated_at?: string
        }
        Update: {
          ai_risk_score?: number | null
          created_at?: string
          deductions?: number
          employee_id?: string
          gross_pay?: number
          id?: string
          net_pay?: number
          payroll_cycle_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_payroll_cycle_id_fkey"
            columns: ["payroll_cycle_id"]
            isOneToOne: false
            referencedRelation: "payroll_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_cycles: {
        Row: {
          ai_anomaly_detected: boolean | null
          created_at: string
          cycle_name: string
          end_date: string
          id: string
          pay_date: string
          start_date: string
          status: string | null
          total_net_pay: number | null
          updated_at: string
        }
        Insert: {
          ai_anomaly_detected?: boolean | null
          created_at?: string
          cycle_name: string
          end_date: string
          id?: string
          pay_date: string
          start_date: string
          status?: string | null
          total_net_pay?: number | null
          updated_at?: string
        }
        Update: {
          ai_anomaly_detected?: boolean | null
          created_at?: string
          cycle_name?: string
          end_date?: string
          id?: string
          pay_date?: string
          start_date?: string
          status?: string | null
          total_net_pay?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      performance_reviews: {
        Row: {
          ai_generated_insights: string | null
          areas_for_improvement: string | null
          career_recommendations: Json | null
          created_at: string
          development_plan: string | null
          employee_id: string
          goals_achieved: string | null
          id: string
          overall_rating: string
          peer_feedback: Json | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string | null
          self_assessment: Json | null
          skill_assessment: Json | null
          updated_at: string
        }
        Insert: {
          ai_generated_insights?: string | null
          areas_for_improvement?: string | null
          career_recommendations?: Json | null
          created_at?: string
          development_plan?: string | null
          employee_id: string
          goals_achieved?: string | null
          id?: string
          overall_rating: string
          peer_feedback?: Json | null
          review_period_end: string
          review_period_start: string
          reviewer_id?: string | null
          self_assessment?: Json | null
          skill_assessment?: Json | null
          updated_at?: string
        }
        Update: {
          ai_generated_insights?: string | null
          areas_for_improvement?: string | null
          career_recommendations?: Json | null
          created_at?: string
          development_plan?: string | null
          employee_id?: string
          goals_achieved?: string | null
          id?: string
          overall_rating?: string
          peer_feedback?: Json | null
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string | null
          self_assessment?: Json | null
          skill_assessment?: Json | null
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
      placement_analytics: {
        Row: {
          created_at: string
          id: string
          industry_breakdown: Json | null
          month_year: string
          placement_rate: number | null
          salary_ranges: Json | null
          total_applications: number
          total_placements: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry_breakdown?: Json | null
          month_year: string
          placement_rate?: number | null
          salary_ranges?: Json | null
          total_applications?: number
          total_placements?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          industry_breakdown?: Json | null
          month_year?: string
          placement_rate?: number | null
          salary_ranges?: Json | null
          total_applications?: number
          total_placements?: number
          updated_at?: string
        }
        Relationships: []
      }
      producers: {
        Row: {
          address: string | null
          certification_status: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          id: string
          monthly_capacity: number | null
          partnership_date: string | null
          producer_name: string
          production_categories: string[] | null
          quality_rating: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          certification_status?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          monthly_capacity?: number | null
          partnership_date?: string | null
          producer_name: string
          production_categories?: string[] | null
          quality_rating?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          certification_status?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          monthly_capacity?: number | null
          partnership_date?: string | null
          producer_name?: string
          production_categories?: string[] | null
          quality_rating?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_certifications: {
        Row: {
          certificate_number: string | null
          certification_body: string
          certification_type: string
          created_at: string
          expiry_date: string | null
          id: string
          issue_date: string
          product_id: string | null
          status: string | null
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          certificate_number?: string | null
          certification_body: string
          certification_type: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date: string
          product_id?: string | null
          status?: string | null
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          certificate_number?: string | null
          certification_body?: string
          certification_type?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string
          product_id?: string | null
          status?: string | null
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_certifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "local_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sales: {
        Row: {
          artisan_id: string | null
          commission_amount: number | null
          commission_rate: number | null
          created_at: string
          customer_contact: string | null
          customer_name: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          product_id: string | null
          quantity_sold: number
          sale_channel: string | null
          sale_date: string | null
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          artisan_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          product_id?: string | null
          quantity_sold: number
          sale_channel?: string | null
          sale_date?: string | null
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          artisan_id?: string | null
          commission_amount?: number | null
          commission_rate?: number | null
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          product_id?: string | null
          quantity_sold?: number
          sale_channel?: string | null
          sale_date?: string | null
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "local_products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          artisan_id: string | null
          category: string
          certification_date: string | null
          certification_status: string | null
          created_at: string
          description: string | null
          dimensions: string | null
          id: string
          images: Json | null
          materials: string[] | null
          price: number
          producer_id: string | null
          product_name: string
          status: string
          stock_quantity: number
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          artisan_id?: string | null
          category: string
          certification_date?: string | null
          certification_status?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          images?: Json | null
          materials?: string[] | null
          price: number
          producer_id?: string | null
          product_name: string
          status?: string
          stock_quantity?: number
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          artisan_id?: string | null
          category?: string
          certification_date?: string | null
          certification_status?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          images?: Json | null
          materials?: string[] | null
          price?: number
          producer_id?: string | null
          product_name?: string
          status?: string
          stock_quantity?: number
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          data: Json | null
          department: string | null
          file_url: string | null
          generated_at: string | null
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
          generated_at?: string | null
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
          generated_at?: string | null
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
      resumes: {
        Row: {
          availability_status: string | null
          created_at: string
          education_level: string | null
          experience_years: number | null
          file_name: string
          file_size_bytes: number | null
          file_url: string
          id: string
          is_active: boolean | null
          preferred_locations: string[] | null
          preferred_salary_max: number | null
          preferred_salary_min: number | null
          skills: string[] | null
          student_id: string | null
          updated_at: string
          upload_date: string | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string
          education_level?: string | null
          experience_years?: number | null
          file_name: string
          file_size_bytes?: number | null
          file_url: string
          id?: string
          is_active?: boolean | null
          preferred_locations?: string[] | null
          preferred_salary_max?: number | null
          preferred_salary_min?: number | null
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string
          upload_date?: string | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string
          education_level?: string | null
          experience_years?: number | null
          file_name?: string
          file_size_bytes?: number | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          preferred_locations?: string[] | null
          preferred_salary_max?: number | null
          preferred_salary_min?: number | null
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resumes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      role_features: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          role_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "system_features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_features_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "dynamic_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_reports_config: {
        Row: {
          created_at: string
          created_by: string | null
          data_sources: string[] | null
          filters: Json | null
          id: string
          is_active: boolean | null
          last_generated: string | null
          next_scheduled: string | null
          recipients: string[] | null
          report_name: string
          report_type: string
          schedule_pattern: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_sources?: string[] | null
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_scheduled?: string | null
          recipients?: string[] | null
          report_name: string
          report_type: string
          schedule_pattern: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_sources?: string[] | null
          filters?: Json | null
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_scheduled?: string | null
          recipients?: string[] | null
          report_name?: string
          report_type?: string
          schedule_pattern?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_reports_config_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          category: string | null
          created_at: string
          district: string | null
          email: string | null
          enrollment_count: number | null
          established_year: number | null
          id: string
          name: string
          phone: string | null
          principal_name: string | null
          udise_code: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          category?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          enrollment_count?: number | null
          established_year?: number | null
          id?: string
          name: string
          phone?: string | null
          principal_name?: string | null
          udise_code?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          enrollment_count?: number | null
          established_year?: number | null
          id?: string
          name?: string
          phone?: string | null
          principal_name?: string | null
          udise_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skill_assessments: {
        Row: {
          created_at: string | null
          id: string
          last_assessed: string | null
          level: string
          next_assessment: string | null
          progress: number
          skill_name: string
          status: string
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_assessed?: string | null
          level: string
          next_assessment?: string | null
          progress?: number
          skill_name: string
          status?: string
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_assessed?: string | null
          level?: string
          next_assessment?: string | null
          progress?: number
          skill_name?: string
          status?: string
          student_id?: string | null
          updated_at?: string | null
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
      staff_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          permissions: Json | null
          required_qualifications: string[] | null
          responsibilities: string[] | null
          role_name: string
          salary_range_max: number | null
          salary_range_min: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          required_qualifications?: string[] | null
          responsibilities?: string[] | null
          role_name: string
          salary_range_max?: number | null
          salary_range_min?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          required_qualifications?: string[] | null
          responsibilities?: string[] | null
          role_name?: string
          salary_range_max?: number | null
          salary_range_min?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      startup_applications: {
        Row: {
          applicant_id: string | null
          application_status:
            | Database["public"]["Enums"]["application_status"]
            | null
          business_idea: string
          business_name: string
          created_at: string | null
          funding_required: number | null
          id: string
          industry: string | null
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          submitted_at: string | null
          team_size: number | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          application_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
          business_idea: string
          business_name: string
          created_at?: string | null
          funding_required?: number | null
          id?: string
          industry?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string | null
          team_size?: number | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          application_status?:
            | Database["public"]["Enums"]["application_status"]
            | null
          business_idea?: string
          business_name?: string
          created_at?: string | null
          funding_required?: number | null
          id?: string
          industry?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          submitted_at?: string | null
          team_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      student_enrollments: {
        Row: {
          created_at: string
          enrollment_date: string
          id: string
          program_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enrollment_date?: string
          id?: string
          program_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enrollment_date?: string
          id?: string
          program_id?: string
          status?: string
          student_id?: string
          updated_at?: string
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
          enrollment_date: string | null
          gender: string | null
          id: string
          status: string | null
          student_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string | null
          gender?: string | null
          id?: string
          status?: string | null
          student_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          enrollment_date?: string | null
          gender?: string | null
          id?: string
          status?: string | null
          student_id?: string
          updated_at?: string
          user_id?: string
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
      system_backups: {
        Row: {
          backup_name: string
          backup_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          id: string
          status: string
        }
        Insert: {
          backup_name: string
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          status?: string
        }
        Update: {
          backup_name?: string
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      system_features: {
        Row: {
          category: string
          created_at: string
          description: string | null
          feature_key: string
          feature_name: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          feature_key: string
          feature_name: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          feature_key?: string
          feature_name?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_type?: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          category: string | null
          contact: string | null
          created_at: string
          experience_years: number | null
          hire_date: string | null
          id: string
          name: string
          qualification: string | null
          school_id: string | null
          status: string | null
          subject: string | null
          teacher_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          contact?: string | null
          created_at?: string
          experience_years?: number | null
          hire_date?: string | null
          id?: string
          name: string
          qualification?: string | null
          school_id?: string | null
          status?: string | null
          subject?: string | null
          teacher_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          contact?: string | null
          created_at?: string
          experience_years?: number | null
          hire_date?: string | null
          id?: string
          name?: string
          qualification?: string | null
          school_id?: string | null
          status?: string | null
          subject?: string | null
          teacher_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      trainers: {
        Row: {
          created_at: string
          experience_years: number | null
          hire_date: string | null
          id: string
          qualification: string | null
          specialization: string | null
          status: string | null
          trainer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          hire_date?: string | null
          id?: string
          qualification?: string | null
          specialization?: string | null
          status?: string | null
          trainer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          hire_date?: string | null
          id?: string
          qualification?: string | null
          specialization?: string | null
          status?: string | null
          trainer_id?: string
          updated_at?: string
          user_id?: string
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
          id: string
          max_participants: number
          name: string
          status: string
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          id?: string
          max_participants?: number
          name: string
          status?: string
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_weeks?: number
          id?: string
          max_participants?: number
          name?: string
          status?: string
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
      user_activities: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string
          device_info: Json | null
          id: string
          ip_address: string | null
          login_time: string | null
          logout_time: string | null
          session_duration_minutes: number | null
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          login_time?: string | null
          logout_time?: string | null
          session_duration_minutes?: number | null
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          login_time?: string | null
          logout_time?: string | null
          session_duration_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          permissions: Json
          role_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          permissions?: Json
          role_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          permissions?: Json
          role_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      workshop_attendance: {
        Row: {
          attendance_status: string | null
          certificate_issued: boolean | null
          created_at: string
          feedback_comments: string | null
          feedback_rating: number | null
          id: string
          student_id: string | null
          updated_at: string
          workshop_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          certificate_issued?: boolean | null
          created_at?: string
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          student_id?: string | null
          updated_at?: string
          workshop_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          certificate_issued?: boolean | null
          created_at?: string
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          student_id?: string | null
          updated_at?: string
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_attendance_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          facilitator_id: string | null
          id: string
          learning_objectives: string[] | null
          materials_provided: string[] | null
          max_participants: number | null
          status: string | null
          title: string
          updated_at: string
          venue: string | null
          workshop_date: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          facilitator_id?: string | null
          id?: string
          learning_objectives?: string[] | null
          materials_provided?: string[] | null
          max_participants?: number | null
          status?: string | null
          title: string
          updated_at?: string
          venue?: string | null
          workshop_date: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          facilitator_id?: string | null
          id?: string
          learning_objectives?: string[] | null
          materials_provided?: string[] | null
          max_participants?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
          workshop_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshops_facilitator_id_fkey"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_feature_access: {
        Args: { user_id: string; feature_key: string }
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
      employment_status:
        | "active"
        | "inactive"
        | "terminated"
        | "on_leave"
        | "probation"
      employment_type: "full_time" | "part_time" | "contract" | "internship"
      inventory_status:
        | "available"
        | "in_use"
        | "maintenance"
        | "damaged"
        | "disposed"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      leave_type:
        | "vacation"
        | "sick"
        | "personal"
        | "maternity"
        | "paternity"
        | "emergency"
        | "bereavement"
      performance_rating:
        | "excellent"
        | "good"
        | "satisfactory"
        | "needs_improvement"
        | "unsatisfactory"
      project_status:
        | "idea"
        | "development"
        | "testing"
        | "launched"
        | "suspended"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "pending" | "in_progress" | "completed" | "cancelled"
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
      application_status: [
        "pending",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
      ],
      employment_status: [
        "active",
        "inactive",
        "terminated",
        "on_leave",
        "probation",
      ],
      employment_type: ["full_time", "part_time", "contract", "internship"],
      inventory_status: [
        "available",
        "in_use",
        "maintenance",
        "damaged",
        "disposed",
      ],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      leave_type: [
        "vacation",
        "sick",
        "personal",
        "maternity",
        "paternity",
        "emergency",
        "bereavement",
      ],
      performance_rating: [
        "excellent",
        "good",
        "satisfactory",
        "needs_improvement",
        "unsatisfactory",
      ],
      project_status: [
        "idea",
        "development",
        "testing",
        "launched",
        "suspended",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["pending", "in_progress", "completed", "cancelled"],
    },
  },
} as const
