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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          priority: string | null
          published_at: string | null
          status: string | null
          target_departments: string[] | null
          target_roles: string[] | null
          title: string
          type: string | null
          updated_at: string
          views_count: number | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          published_at?: string | null
          status?: string | null
          target_departments?: string[] | null
          target_roles?: string[] | null
          title: string
          type?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          published_at?: string | null
          status?: string | null
          target_departments?: string[] | null
          target_roles?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string
          views_count?: number | null
        }
        Relationships: []
      }
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
      course_enrollments: {
        Row: {
          assignment_reason: string | null
          completion_date: string | null
          course_id: string
          created_at: string
          enrollment_date: string
          final_grade: string | null
          id: string
          status: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          assignment_reason?: string | null
          completion_date?: string | null
          course_id: string
          created_at?: string
          enrollment_date?: string
          final_grade?: string | null
          id?: string
          status?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          assignment_reason?: string | null
          completion_date?: string | null
          course_id?: string
          created_at?: string
          enrollment_date?: string
          final_grade?: string | null
          id?: string
          status?: string | null
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
      data_change_history: {
        Row: {
          after_data: Json | null
          before_data: Json | null
          changed_fields: string[] | null
          created_at: string
          id: string
          ip_address: unknown | null
          operation: string
          record_id: string
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          after_data?: Json | null
          before_data?: Json | null
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          operation: string
          record_id: string
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          after_data?: Json | null
          before_data?: Json | null
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          operation?: string
          record_id?: string
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_access_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          document_id: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          document_id: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          document_id?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          allowed_file_types: string[] | null
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          max_file_size_mb: number | null
          name: string
          requires_approval: boolean | null
          retention_days: number | null
          updated_at: string
        }
        Insert: {
          allowed_file_types?: string[] | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          max_file_size_mb?: number | null
          name: string
          requires_approval?: boolean | null
          retention_days?: number | null
          updated_at?: string
        }
        Update: {
          allowed_file_types?: string[] | null
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          max_file_size_mb?: number | null
          name?: string
          requires_approval?: boolean | null
          retention_days?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      document_permissions: {
        Row: {
          created_at: string
          document_id: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          permission_type: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          document_id: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_type: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          document_id?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          permission_type?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          certificate_info: Json | null
          created_at: string
          document_id: string
          id: string
          is_valid: boolean | null
          signature_data: string
          signature_hash: string
          signature_location: string | null
          signature_reason: string | null
          signature_type: string | null
          signed_at: string
          signer_id: string
          verification_details: Json | null
        }
        Insert: {
          certificate_info?: Json | null
          created_at?: string
          document_id: string
          id?: string
          is_valid?: boolean | null
          signature_data: string
          signature_hash: string
          signature_location?: string | null
          signature_reason?: string | null
          signature_type?: string | null
          signed_at?: string
          signer_id: string
          verification_details?: Json | null
        }
        Update: {
          certificate_info?: Json | null
          created_at?: string
          document_id?: string
          id?: string
          is_valid?: boolean | null
          signature_data?: string
          signature_hash?: string
          signature_location?: string | null
          signature_reason?: string | null
          signature_type?: string | null
          signed_at?: string
          signer_id?: string
          verification_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_workflows: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number | null
          document_id: string
          id: string
          initiated_at: string
          initiated_by: string | null
          status: string | null
          total_steps: number
          updated_at: string
          workflow_data: Json | null
          workflow_name: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          document_id: string
          id?: string
          initiated_at?: string
          initiated_by?: string | null
          status?: string | null
          total_steps: number
          updated_at?: string
          workflow_data?: Json | null
          workflow_name: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          document_id?: string
          id?: string
          initiated_at?: string
          initiated_by?: string | null
          status?: string | null
          total_steps?: number
          updated_at?: string
          workflow_data?: Json | null
          workflow_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_workflows_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          access_count: number | null
          approved_at: string | null
          approved_by: string | null
          category_id: string | null
          checksum: string | null
          created_at: string
          description: string | null
          expires_at: string | null
          file_extension: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_latest_version: boolean | null
          last_accessed_at: string | null
          metadata: Json | null
          parent_document_id: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
          uploaded_by: string | null
          version: number | null
          visibility: string | null
        }
        Insert: {
          access_count?: number | null
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string | null
          checksum?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          file_extension: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          is_latest_version?: boolean | null
          last_accessed_at?: string | null
          metadata?: Json | null
          parent_document_id?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          version?: number | null
          visibility?: string | null
        }
        Update: {
          access_count?: number | null
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string | null
          checksum?: string | null
          created_at?: string
          description?: string | null
          expires_at?: string | null
          file_extension?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          is_latest_version?: boolean | null
          last_accessed_at?: string | null
          metadata?: Json | null
          parent_document_id?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          version?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
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
          duration_months: number | null
          id: string
          instructor_id: string | null
          max_students: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          course_code: string
          course_name: string
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          duration_months?: number | null
          id?: string
          instructor_id?: string | null
          max_students?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          course_code?: string
          course_name?: string
          created_at?: string
          credits?: number | null
          department?: string | null
          description?: string | null
          duration_months?: number | null
          id?: string
          instructor_id?: string | null
          max_students?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          clicked_at: string | null
          created_at: string
          delivered_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          opened_at: string | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          status: string | null
          subject: string
          template_id: string | null
          variables_used: Json | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          opened_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          template_id?: string | null
          variables_used?: Json | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          template_id?: string | null
          variables_used?: Json | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string
          created_by: string | null
          html_content: string
          id: string
          name: string
          status: string | null
          subject: string
          text_content: string | null
          type: string | null
          updated_at: string
          variables: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          html_content: string
          id?: string
          name: string
          status?: string | null
          subject: string
          text_content?: string | null
          type?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          html_content?: string
          id?: string
          name?: string
          status?: string | null
          subject?: string
          text_content?: string | null
          type?: string | null
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
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
      employee_sessions: {
        Row: {
          created_at: string
          employee_id: string | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          session_token: string
          started_at: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token: string
          started_at?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token?: string
          started_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_sessions_employee_id_fkey"
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
          assigned_to: string | null
          assigned_to_name: string | null
          auto_assigned: boolean | null
          completion_percentage: number | null
          created_at: string
          department: string | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          employee_id: string | null
          estimated_hours: number | null
          id: string
          overtime_hours: number | null
          overtime_rate: number | null
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
          assigned_to?: string | null
          assigned_to_name?: string | null
          auto_assigned?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          department?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          estimated_hours?: number | null
          id?: string
          overtime_hours?: number | null
          overtime_rate?: number | null
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
          assigned_to?: string | null
          assigned_to_name?: string | null
          auto_assigned?: boolean | null
          completion_percentage?: number | null
          created_at?: string
          department?: string | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          employee_id?: string | null
          estimated_hours?: number | null
          id?: string
          overtime_hours?: number | null
          overtime_rate?: number | null
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
      error_logs: {
        Row: {
          created_at: string
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          user_action: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_action?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_action?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      export_logs: {
        Row: {
          created_at: string
          export_data: Json | null
          export_format: string
          export_type: string
          exported_by: string | null
          file_path: string | null
          id: string
        }
        Insert: {
          created_at?: string
          export_data?: Json | null
          export_format: string
          export_type: string
          exported_by?: string | null
          file_path?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          export_data?: Json | null
          export_format?: string
          export_type?: string
          exported_by?: string | null
          file_path?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_logs_exported_by_fkey"
            columns: ["exported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hr_reports: {
        Row: {
          created_at: string
          date_range_end: string | null
          date_range_start: string | null
          department: string | null
          generated_by: string | null
          id: string
          report_data: Json
          report_name: string
          report_type: string
        }
        Insert: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          department?: string | null
          generated_by?: string | null
          id?: string
          report_data: Json
          report_name: string
          report_type: string
        }
        Update: {
          created_at?: string
          date_range_end?: string | null
          date_range_start?: string | null
          department?: string | null
          generated_by?: string | null
          id?: string
          report_data?: Json
          report_name?: string
          report_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      login_attempts: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          email: string
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          email: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success: boolean
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          email?: string
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_frequency: string | null
          email_notifications: boolean | null
          id: string
          notification_types: Json | null
          push_notifications: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_notifications: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_frequency?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_types?: Json | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_frequency?: string | null
          email_notifications?: boolean | null
          id?: string
          notification_types?: Json | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_notifications?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read: boolean | null
          title: string
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      password_history: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      payroll_cycles: {
        Row: {
          created_at: string
          cycle_name: string
          end_date: string
          id: string
          pay_date: string
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cycle_name: string
          end_date: string
          id?: string
          pay_date: string
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cycle_name?: string
          end_date?: string
          id?: string
          pay_date?: string
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payroll_entries: {
        Row: {
          ai_risk_score: number | null
          base_salary: number | null
          bonuses: number | null
          created_at: string
          cycle_id: string | null
          deductions: number | null
          employee_id: string | null
          id: string
          net_pay: number | null
          overtime_hours: number | null
          overtime_pay: number | null
          overtime_rate: number | null
          period_end: string
          period_start: string
          status: string | null
          updated_at: string
        }
        Insert: {
          ai_risk_score?: number | null
          base_salary?: number | null
          bonuses?: number | null
          created_at?: string
          cycle_id?: string | null
          deductions?: number | null
          employee_id?: string | null
          id?: string
          net_pay?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          overtime_rate?: number | null
          period_end: string
          period_start: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          ai_risk_score?: number | null
          base_salary?: number | null
          bonuses?: number | null
          created_at?: string
          cycle_id?: string | null
          deductions?: number | null
          employee_id?: string | null
          id?: string
          net_pay?: number | null
          overtime_hours?: number | null
          overtime_pay?: number | null
          overtime_rate?: number | null
          period_end?: string
          period_start?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_entries_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "payroll_cycles"
            referencedColumns: ["id"]
          },
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
          communication: number | null
          created_at: string
          department: string | null
          employee_id: string | null
          employee_name: string | null
          goals: string | null
          id: string
          innovation: number | null
          leadership: number | null
          overall_rating: number | null
          period_end: string
          period_start: string
          position: string | null
          problem_solving: number | null
          review_period: string | null
          reviewer_id: string | null
          reviewer_name: string | null
          status: string | null
          teamwork: number | null
          technical_skills: number | null
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          areas_for_improvement?: string | null
          communication?: number | null
          created_at?: string
          department?: string | null
          employee_id?: string | null
          employee_name?: string | null
          goals?: string | null
          id?: string
          innovation?: number | null
          leadership?: number | null
          overall_rating?: number | null
          period_end: string
          period_start: string
          position?: string | null
          problem_solving?: number | null
          review_period?: string | null
          reviewer_id?: string | null
          reviewer_name?: string | null
          status?: string | null
          teamwork?: number | null
          technical_skills?: number | null
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          areas_for_improvement?: string | null
          communication?: number | null
          created_at?: string
          department?: string | null
          employee_id?: string | null
          employee_name?: string | null
          goals?: string | null
          id?: string
          innovation?: number | null
          leadership?: number | null
          overall_rating?: number | null
          period_end?: string
          period_start?: string
          position?: string | null
          problem_solving?: number | null
          review_period?: string | null
          reviewer_id?: string | null
          reviewer_name?: string | null
          status?: string | null
          teamwork?: number | null
          technical_skills?: number | null
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
          avatar_url: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          full_name: string | null
          id: string
          last_login: string | null
          password_reset_expires: string | null
          password_reset_token: string | null
          phone: string | null
          role: string | null
          status: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          password_reset_expires?: string | null
          password_reset_token?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          two_factor_enabled?: boolean | null
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
      student_enrollments: {
        Row: {
          completion_date: string | null
          created_at: string
          enrollment_date: string
          grade: string | null
          id: string
          program_id: string
          status: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          program_id: string
          status?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          enrollment_date?: string
          grade?: string | null
          id?: string
          program_id?: string
          status?: string | null
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
          gender?: string | null
          id?: string
          status?: string | null
          student_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          recorded_at: string
          tags: Json | null
        }
        Insert: {
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          recorded_at?: string
          tags?: Json | null
        }
        Update: {
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          recorded_at?: string
          tags?: Json | null
        }
        Relationships: []
      }
      trainers: {
        Row: {
          created_at: string
          experience_years: number | null
          id: string
          specialization: string | null
          trainer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          experience_years?: number | null
          id?: string
          specialization?: string | null
          trainer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          experience_years?: number | null
          id?: string
          specialization?: string | null
          trainer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          status: string | null
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
          status?: string | null
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
          status?: string | null
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
      user_permissions: {
        Row: {
          created_at: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean | null
          permission_name: string
          resource_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission_name: string
          resource_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission_name?: string
          resource_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          session_token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      attendance_statistics: {
        Row: {
          absent_days: number | null
          attendance_rate: number | null
          employee_id: string | null
          late_days: number | null
          present_days: number | null
          total_days: number | null
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
      task_statistics: {
        Row: {
          avg_completion: number | null
          completed_tasks: number | null
          employee_id: string | null
          in_progress_tasks: number | null
          pending_tasks: number | null
          total_actual_hours: number | null
          total_estimated_hours: number | null
          total_tasks: number | null
        }
        Relationships: []
      }
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
