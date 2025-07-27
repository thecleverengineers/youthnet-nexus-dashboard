import { supabase } from '@/integrations/supabase/client';

export interface LivelihoodProgram {
  id: string;
  program_name: string;
  duration_weeks?: number;
  budget?: number;
  coordinator_id?: string;
  max_participants?: number;
  expected_outcomes?: string[];
  focus_area: string;
  target_demographic?: string;
  program_status?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramParticipant {
  id: string;
  program_id: string;
  participant_name: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  enrollment_date: string;
  completion_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
  livelihood_programs?: LivelihoodProgram;
}

export const livelihoodService = {
  // Programs
  async getPrograms(limit?: number) {
    const query = supabase
      .from('livelihood_programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching livelihood programs:', error);
      return [];
    }
    return data as LivelihoodProgram[];
  },

  async createProgram(program: Omit<LivelihoodProgram, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('livelihood_programs')
      .insert([program])
      .select()
      .single();
    
    if (error) throw error;
    return data as LivelihoodProgram;
  },

  async updateProgram(id: string, updates: Partial<LivelihoodProgram>) {
    const { data, error } = await supabase
      .from('livelihood_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as LivelihoodProgram;
  },

  // Since the tables don't exist yet, return mock data
  async getParticipants(programId?: string, limit?: number) {
    // Mock data for now - will be replaced when tables are created
    const mockParticipants = [
      {
        id: '1',
        program_id: '1',
        participant_name: 'Sample Participant',
        contact_phone: '+91-9876543210',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'enrolled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    if (limit) {
      return mockParticipants.slice(0, limit);
    }
    return mockParticipants;
  },

  async addParticipant(participant: Omit<ProgramParticipant, 'id' | 'created_at' | 'updated_at'>) {
    // Mock implementation for now
    return {
      id: Date.now().toString(),
      ...participant,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as ProgramParticipant;
  },

  async updateParticipant(id: string, updates: Partial<ProgramParticipant>) {
    // Mock implementation for now
    return {
      id,
      ...updates,
      updated_at: new Date().toISOString()
    } as ProgramParticipant;
  }
};