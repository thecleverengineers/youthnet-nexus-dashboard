import { supabase } from '@/integrations/supabase/client';

export const analyticsService = {
  async getMonthlyGrowthData() {
    // Get the last 6 months of data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [studentsData, employeesData, projectsData] = await Promise.all([
      // Students data by month
      supabase
        .from('students')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString()),
      
      // Employees data by month
      supabase
        .from('employees')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString()),
      
      // Projects data by month
      supabase
        .from('incubation_projects')
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())
    ]);

    // Process data into monthly counts
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const studentsCount = studentsData.data?.filter(s => {
        const createdAt = new Date(s.created_at);
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length || 0;

      const employeesCount = employeesData.data?.filter(e => {
        const createdAt = new Date(e.created_at);
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length || 0;

      const projectsCount = projectsData.data?.filter(p => {
        const createdAt = new Date(p.created_at);
        return createdAt >= monthStart && createdAt <= monthEnd;
      }).length || 0;

      months.push({
        month: monthKey,
        students: studentsCount,
        employees: employeesCount,
        projects: projectsCount
      });
    }

    return months;
  },

  async getDepartmentData() {
    const [studentsCount, employeesCount, projectsCount, applicationsCount] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('employees').select('*', { count: 'exact', head: true }),
      supabase.from('incubation_projects').select('*', { count: 'exact', head: true }),
      supabase.from('job_applications').select('*', { count: 'exact', head: true })
    ]);

    return [
      { department: 'Education', participants: studentsCount.count || 0 },
      { department: 'HR', participants: employeesCount.count || 0 },
      { department: 'Incubation', participants: projectsCount.count || 0 },
      { department: 'Job Centre', participants: applicationsCount.count || 0 }
    ];
  }
};