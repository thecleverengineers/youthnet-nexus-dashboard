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
      [_ in never]: never
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
