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
      ai_insights: {
        Row: {
          confidence_score: number
          created_at: string
          entity_id: string | null
          entity_type: string
          expires_at: string | null
          id: string
          insight_type: string
          prediction_data: Json
          recommendations: Json | null
          validity_period: number | null
        }
        Insert: {
          confidence_score: number
          created_at?: string
          entity_id?: string | null
          entity_type: string
          expires_at?: string | null
          id?: string
          insight_type: string
          prediction_data: Json
          recommendations?: Json | null
          validity_period?: number | null
        }
        Update: {
          confidence_score?: number
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          prediction_data?: Json
          recommendations?: Json | null
          validity_period?: number | null
        }
        Relationships: []
      }
      analytics_dashboards: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          last_refreshed: string | null
          name: string
          refresh_interval: number | null
          updated_at: string
        }
        Insert: {
          config: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_refreshed?: string | null
          name: string
          refresh_interval?: number | null
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          last_refreshed?: string | null
          name?: string
          refresh_interval?: number | null
          updated_at?: string
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
          created_at: string
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          priority: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
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
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
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
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: string
          status?: string
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
          department: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string
          employment_status: string
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          gender: string | null
          hire_date: string | null
          id: string
          join_date: string | null
          manager_id: string | null
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
          date_of_joining?: string | null
          department: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id: string
          employment_status?: string
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          gender?: string | null
          hire_date?: string | null
          id?: string
          join_date?: string | null
          manager_id?: string | null
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
          date_of_joining?: string | null
          department?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string
          employment_status?: string
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          gender?: string | null
          hire_date?: string | null
          id?: string
          join_date?: string | null
          manager_id?: string | null
          position?: string
          probation_end_date?: string | null
          salary?: number | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
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
      payroll: {
        Row: {
          ai_calculated: boolean | null
          ai_risk_score: number | null
          attendance_penalty: number | null
          base_salary: number
          bonuses: number | null
          created_at: string | null
          cycle_id: string | null
          deductions: number | null
          employee_id: string | null
          gross_pay: number
          id: string
          net_pay: number
          overtime_hours: number | null
          overtime_rate: number | null
          pay_period_end: string
          pay_period_start: string
          payment_date: string | null
          payment_status: string | null
          performance_bonus: number | null
          tax_deductions: number | null
          updated_at: string | null
        }
        Insert: {
          ai_calculated?: boolean | null
          ai_risk_score?: number | null
          attendance_penalty?: number | null
          base_salary: number
          bonuses?: number | null
          created_at?: string | null
          cycle_id?: string | null
          deductions?: number | null
          employee_id?: string | null
          gross_pay: number
          id?: string
          net_pay: number
          overtime_hours?: number | null
          overtime_rate?: number | null
          pay_period_end: string
          pay_period_start: string
          payment_date?: string | null
          payment_status?: string | null
          performance_bonus?: number | null
          tax_deductions?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_calculated?: boolean | null
          ai_risk_score?: number | null
          attendance_penalty?: number | null
          base_salary?: number
          bonuses?: number | null
          created_at?: string | null
          cycle_id?: string | null
          deductions?: number | null
          employee_id?: string | null
          gross_pay?: number
          id?: string
          net_pay?: number
          overtime_hours?: number | null
          overtime_rate?: number | null
          pay_period_end?: string
          pay_period_start?: string
          payment_date?: string | null
          payment_status?: string | null
          performance_bonus?: number | null
          tax_deductions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "payroll_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_cycles: {
        Row: {
          ai_anomaly_detected: boolean | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          cycle_name: string
          end_date: string
          id: string
          pay_date: string
          start_date: string
          status: string
          total_deductions: number | null
          total_gross_pay: number | null
          total_net_pay: number | null
          updated_at: string
        }
        Insert: {
          ai_anomaly_detected?: boolean | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          cycle_name: string
          end_date: string
          id?: string
          pay_date: string
          start_date: string
          status?: string
          total_deductions?: number | null
          total_gross_pay?: number | null
          total_net_pay?: number | null
          updated_at?: string
        }
        Update: {
          ai_anomaly_detected?: boolean | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          cycle_name?: string
          end_date?: string
          id?: string
          pay_date?: string
          start_date?: string
          status?: string
          total_deductions?: number | null
          total_gross_pay?: number | null
          total_net_pay?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_cycles_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_cycles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          auto_calculated: boolean | null
          created_at: string
          data_source: string | null
          employee_id: string
          id: string
          metric_name: string
          metric_value: number
          period_end: string
          period_start: string
          target_value: number | null
          unit: string | null
        }
        Insert: {
          auto_calculated?: boolean | null
          created_at?: string
          data_source?: string | null
          employee_id: string
          id?: string
          metric_name: string
          metric_value: number
          period_end: string
          period_start: string
          target_value?: number | null
          unit?: string | null
        }
        Update: {
          auto_calculated?: boolean | null
          created_at?: string
          data_source?: string | null
          employee_id?: string
          id?: string
          metric_name?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          target_value?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          ai_generated_insights: string | null
          areas_for_improvement: string | null
          career_recommendations: Json | null
          created_at: string | null
          development_plan: string | null
          employee_id: string | null
          goals_achieved: string | null
          id: string
          next_review_date: string | null
          overall_rating: Database["public"]["Enums"]["performance_rating"]
          peer_feedback: Json | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string | null
          self_assessment: Json | null
          skill_assessment: Json | null
          status: string | null
          strengths: string | null
          updated_at: string | null
        }
        Insert: {
          ai_generated_insights?: string | null
          areas_for_improvement?: string | null
          career_recommendations?: Json | null
          created_at?: string | null
          development_plan?: string | null
          employee_id?: string | null
          goals_achieved?: string | null
          id?: string
          next_review_date?: string | null
          overall_rating: Database["public"]["Enums"]["performance_rating"]
          peer_feedback?: Json | null
          review_period_end: string
          review_period_start: string
          reviewer_id?: string | null
          self_assessment?: Json | null
          skill_assessment?: Json | null
          status?: string | null
          strengths?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_generated_insights?: string | null
          areas_for_improvement?: string | null
          career_recommendations?: Json | null
          created_at?: string | null
          development_plan?: string | null
          employee_id?: string | null
          goals_achieved?: string | null
          id?: string
          next_review_date?: string | null
          overall_rating?: Database["public"]["Enums"]["performance_rating"]
          peer_feedback?: Json | null
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string | null
          self_assessment?: Json | null
          skill_assessment?: Json | null
          status?: string | null
          strengths?: string | null
          updated_at?: string | null
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
      task_comments: {
        Row: {
          attachments: Json | null
          comment: string
          created_at: string
          employee_id: string
          id: string
          task_id: string
        }
        Insert: {
          attachments?: Json | null
          comment: string
          created_at?: string
          employee_id: string
          id?: string
          task_id: string
        }
        Update: {
          attachments?: Json | null
          comment?: string
          created_at?: string
          employee_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "employee_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_time_logs: {
        Row: {
          activity_type: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          employee_id: string
          end_time: string | null
          id: string
          start_time: string
          task_id: string
        }
        Insert: {
          activity_type?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          employee_id: string
          end_time?: string | null
          id?: string
          start_time: string
          task_id: string
        }
        Update: {
          activity_type?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          employee_id?: string
          end_time?: string | null
          id?: string
          start_time?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_time_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_time_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "employee_tasks"
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
      employment_status:
        | "active"
        | "inactive"
        | "terminated"
        | "on_leave"
        | "probation"
      employment_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "intern"
        | "consultant"
      inventory_status:
        | "available"
        | "in_use"
        | "maintenance"
        | "damaged"
        | "disposed"
      job_status: "open" | "closed" | "filled"
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
      employment_status: [
        "active",
        "inactive",
        "terminated",
        "on_leave",
        "probation",
      ],
      employment_type: [
        "full_time",
        "part_time",
        "contract",
        "intern",
        "consultant",
      ],
      inventory_status: [
        "available",
        "in_use",
        "maintenance",
        "damaged",
        "disposed",
      ],
      job_status: ["open", "closed", "filled"],
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
      training_status: ["pending", "active", "completed", "dropped"],
      user_role: ["admin", "staff", "trainer", "student"],
    },
  },
} as const
