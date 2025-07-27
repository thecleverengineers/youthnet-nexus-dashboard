import { supabase } from '@/integrations/supabase/client';

export interface SkillAssessment {
  id: string;
  skill_name: string;
  level: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed';
  last_assessed?: string;
  next_assessment?: string;
  student_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'expired';
  issue_date?: string;
  expiry_date?: string;
  expected_completion?: string;
  credential_id?: string;
  skills?: string[];
  student_id?: string;
  created_at: string;
  updated_at: string;
}

export const skillService = {
  // Skill Assessments
  async getSkillAssessments(limit?: number) {
    const query = supabase
      .from('skill_assessments')
      .select(`
        *,
        students:student_id (
          student_id,
          profiles:user_id (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as SkillAssessment[];
  },

  async createSkillAssessment(assessment: Omit<SkillAssessment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .insert([assessment])
      .select()
      .single();
    
    if (error) throw error;
    return data as SkillAssessment;
  },

  async updateSkillAssessment(id: string, updates: Partial<SkillAssessment>) {
    const { data, error } = await supabase
      .from('skill_assessments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SkillAssessment;
  },

  // Certifications
  async getCertifications(limit?: number) {
    const query = supabase
      .from('certifications')
      .select(`
        *,
        students:student_id (
          student_id,
          profiles:user_id (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Certification[];
  },

  async createCertification(certification: Omit<Certification, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('certifications')
      .insert([certification])
      .select()
      .single();
    
    if (error) throw error;
    return data as Certification;
  },

  async updateCertification(id: string, updates: Partial<Certification>) {
    const { data, error } = await supabase
      .from('certifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Certification;
  }
};