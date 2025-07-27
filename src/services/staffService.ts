import { supabase } from '@/integrations/supabase/client';

export interface StaffTemplate {
  id: string;
  role_name: string;
  description?: string;
  permissions: any[];
  responsibilities?: string[];
  required_qualifications?: string[];
  salary_range_min?: number;
  salary_range_max?: number;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const staffService = {
  async getStaffTemplates() {
    const { data, error } = await supabase
      .from('staff_templates')
      .select('*')
      .eq('is_active', true)
      .order('role_name');

    if (error) throw error;
    return data as StaffTemplate[];
  },

  async createStaffTemplate(template: Omit<StaffTemplate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('staff_templates')
      .insert([template])
      .select()
      .single();
    
    if (error) throw error;
    return data as StaffTemplate;
  },

  async updateStaffTemplate(id: string, updates: Partial<StaffTemplate>) {
    const { data, error } = await supabase
      .from('staff_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as StaffTemplate;
  },

  async deleteStaffTemplate(id: string) {
    const { error } = await supabase
      .from('staff_templates')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  }
};