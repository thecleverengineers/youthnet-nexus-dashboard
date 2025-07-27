import { supabase } from '@/integrations/supabase/client';

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  max_participants: number;
  trainer_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const trainingService = {
  async getTrainingPrograms() {
    const { data, error } = await supabase
      .from('training_programs')
      .select(`
        *,
        trainers:trainer_id (
          trainer_id,
          profiles:user_id (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as TrainingProgram[];
  },

  async createTrainingProgram(program: Omit<TrainingProgram, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('training_programs')
      .insert([program])
      .select()
      .single();
    
    if (error) throw error;
    return data as TrainingProgram;
  },

  async updateTrainingProgram(id: string, updates: Partial<TrainingProgram>) {
    const { data, error } = await supabase
      .from('training_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TrainingProgram;
  },

  async deleteTrainingProgram(id: string) {
    const { error } = await supabase
      .from('training_programs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getTrainingAnalytics() {
    const { data: programs, error } = await supabase
      .from('training_programs')
      .select('*');

    if (error) throw error;

    const totalPrograms = programs?.length || 0;
    const activePrograms = programs?.filter(p => p.status === 'active').length || 0;
    const totalParticipants = programs?.reduce((sum, p) => sum + (p.max_participants || 0), 0) || 0;

    return {
      totalPrograms,
      activePrograms,
      totalParticipants,
      completionRate: activePrograms > 0 ? Math.round((activePrograms / totalPrograms) * 100) : 0
    };
  }
};