
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardData() {
  const profilesQuery = useQuery({
    queryKey: ['profiles-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');
      return count || 0;
    },
  });

  const trainersQuery = useQuery({
    queryKey: ['trainers-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'trainer');
      return count || 0;
    },
  });

  const jobApplicationsQuery = useQuery({
    queryKey: ['job-applications-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('application_status', 'selected');
      return count || 0;
    },
  });

  const startupProjectsQuery = useQuery({
    queryKey: ['startup-projects-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('startup_applications')
        .select('*', { count: 'exact', head: true })
        .in('application_status', ['approved', 'in_progress', 'completed']);
      return count || 0;
    },
  });

  const departmentStatsQuery = useQuery({
    queryKey: ['department-stats'],
    queryFn: async () => {
      // Get employee counts by department
      const { data: employees } = await supabase
        .from('employees')
        .select('department, employment_status');

      // Process data for department performance chart
      const departmentData = [
        { name: 'Education', students: 0, completion: 85 },
        { name: 'Skill Dev', students: 0, completion: 92 },
        { name: 'Job Centre', students: 0, completion: 78 },
        { name: 'Career Dev', students: 0, completion: 88 },
        { name: 'Incubation', students: 0, completion: 95 },
      ];

      if (employees) {
        // Count employees by department
        const deptCounts = employees.reduce((acc: any, emp) => {
          if (emp.employment_status === 'active') {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
          }
          return acc;
        }, {});

        departmentData[0].students = deptCounts['Education'] || 0;
        departmentData[1].students = deptCounts['Skill Development'] || 0;
        departmentData[2].students = deptCounts['Job Centre'] || 0;
        departmentData[3].students = deptCounts['Career Development'] || 0;
        departmentData[4].students = deptCounts['Incubation'] || 0;
      }

      return departmentData;
    },
  });

  const placementDataQuery = useQuery({
    queryKey: ['placement-data'],
    queryFn: async () => {
      // Get job applications with job details
      const { data: applications } = await supabase
        .from('job_applications')
        .select(`
          application_status,
          job_postings(company, title)
        `)
        .eq('application_status', 'selected');

      // Mock placement distribution data
      return [
        { name: 'IT/Software', value: 35, color: '#8884d8' },
        { name: 'Banking', value: 25, color: '#82ca9d' },
        { name: 'Retail', value: 20, color: '#ffc658' },
        { name: 'Manufacturing', value: 15, color: '#ff7c7c' },
        { name: 'Others', value: 5, color: '#8dd1e1' },
      ];
    },
  });

  return {
    studentsCount: profilesQuery.data || 0,
    trainersCount: trainersQuery.data || 0,
    jobPlacements: jobApplicationsQuery.data || 0,
    incubationProjects: startupProjectsQuery.data || 0,
    departmentData: departmentStatsQuery.data || [],
    placementData: placementDataQuery.data || [],
    loading: profilesQuery.isLoading || trainersQuery.isLoading || jobApplicationsQuery.isLoading || startupProjectsQuery.isLoading,
  };
}
