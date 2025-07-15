
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Employee {
  id: string;
  employee_id: string;
  user_id: string;
  department: string;
  position: string;
  employment_status: string;
  employment_type: string;
  hire_date: string;
  salary: number;
  profiles?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export const employeeService = {
  async fetchEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees');
      return [];
    }

    return (data || []) as Employee[];
  },

  async createEmployee(employeeData: any): Promise<Employee | null> {
    try {
      // Generate a unique ID for the profile
      const profileId = crypto.randomUUID();
      
      // First create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          full_name: employeeData.full_name,
          email: employeeData.email,
          phone: employeeData.phone,
          role: 'staff'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error('Failed to create employee profile');
        return null;
      }

      // Then create the employee record
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert({
          employee_id: employeeData.employee_id,
          user_id: profile.id,
          department: employeeData.department,
          position: employeeData.position,
          employment_status: employeeData.employment_status || 'active',
          employment_type: employeeData.employment_type || 'full_time',
          hire_date: employeeData.hire_date,
          salary: employeeData.salary,
          gender: employeeData.gender,
          emergency_contact_name: employeeData.emergency_contact_name,
          emergency_contact_phone: employeeData.emergency_contact_phone
        })
        .select(`
          *,
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .single();

      if (employeeError) {
        console.error('Error creating employee:', employeeError);
        toast.error('Failed to create employee');
        return null;
      }

      toast.success('Employee created successfully');
      return employee as Employee;
    } catch (error) {
      console.error('Error in createEmployee:', error);
      toast.error('Failed to create employee');
      return null;
    }
  },

  async updateEmployee(id: string, updates: any): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      toast.error('Failed to update employee');
      return null;
    }

    toast.success('Employee updated successfully');
    return data as Employee;
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
      return false;
    }

    toast.success('Employee deleted successfully');
    return true;
  }
};
