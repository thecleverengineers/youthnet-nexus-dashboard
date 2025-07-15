
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: string; // Changed from literal union to string to match database
  notes?: string;
  employees?: {
    employee_id: string;
    profiles?: {
      full_name: string;
    };
  };
}

export const attendanceService = {
  async fetchAttendanceRecords(startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        employees (
          employee_id,
          profiles (
            full_name
          )
        )
      `)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance records');
      return [];
    }

    return (data || []) as AttendanceRecord[];
  },

  async checkIn(employeeId: string): Promise<AttendanceRecord | null> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    // Check if already checked in today
    const { data: existing } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();

    if (existing) {
      toast.error('Already checked in today');
      return null;
    }

    const isLate = new Date().getHours() > 9 || (new Date().getHours() === 9 && new Date().getMinutes() > 15);
    
    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        employee_id: employeeId,
        date: today,
        check_in: now,
        status: isLate ? 'late' : 'present'
      })
      .select()
      .single();

    if (error) {
      console.error('Error checking in:', error);
      toast.error('Check-in failed');
      return null;
    }

    toast.success(`Checked in at ${format(new Date(), 'HH:mm')}${isLate ? ' (Late)' : ''}`);
    return data as AttendanceRecord;
  },

  async checkOut(employeeId: string): Promise<AttendanceRecord | null> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('attendance_records')
      .update({ check_out: now })
      .eq('employee_id', employeeId)
      .eq('date', today)
      .select()
      .single();

    if (error) {
      console.error('Error checking out:', error);
      toast.error('Check-out failed');
      return null;
    }

    toast.success(`Checked out at ${format(new Date(), 'HH:mm')}`);
    return data as AttendanceRecord;
  },

  async getTodayAttendance(employeeId: string): Promise<AttendanceRecord | null> {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching today attendance:', error);
      return null;
    }

    return data as AttendanceRecord;
  }
};
