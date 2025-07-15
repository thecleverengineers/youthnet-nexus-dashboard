
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardData() {
  const studentsQuery = useQuery({
    queryKey: ['students-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const trainersQuery = useQuery({
    queryKey: ['trainers-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const employeesQuery = useQuery({
    queryKey: ['employees-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const jobApplicationsQuery = useQuery({
    queryKey: ['job-applications-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'selected');
      return count || 0;
    },
  });

  const incubationProjectsQuery = useQuery({
    queryKey: ['incubation-projects-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('incubation_projects')
        .select('*', { count: 'exact', head: true })
        .in('status', ['development', 'testing', 'launched']);
      return count || 0;
    },
  });

  const departmentStatsQuery = useQuery({
    queryKey: ['department-stats'],
    queryFn: async () => {
      // Get real enrollment data
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select(`
          status,
          program_id,
          training_programs(name)
        `);

      // Get course enrollments
      const { data: courseEnrollments } = await supabase
        .from('course_enrollments')
        .select('status');

      // Process data for department performance chart
      const departmentData = [
        { 
          name: 'Education', 
          students: courseEnrollments?.filter(e => e.status === 'enrolled').length || 0, 
          completion: 85 
        },
        { 
          name: 'Skill Dev', 
          students: enrollments?.filter(e => e.status === 'active').length || 0, 
          completion: 92 
        },
        { 
          name: 'Job Centre', 
          students: Math.floor((enrollments?.length || 0) * 0.5), 
          completion: 78 
        },
        { 
          name: 'Career Dev', 
          students: Math.floor((enrollments?.length || 0) * 0.3), 
          completion: 88 
        },
        { 
          name: 'Incubation', 
          students: Math.floor((enrollments?.length || 0) * 0.1), 
          completion: 95 
        },
      ];

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
          status,
          job_postings(company, title)
        `)
        .eq('status', 'selected');

      // Process placement distribution data
      const companyTypes = applications?.reduce((acc: any, app: any) => {
        const company = app.job_postings?.company || 'Others';
        // Simple categorization based on company name
        let category = 'Others';
        if (company.toLowerCase().includes('tech') || company.toLowerCase().includes('software') || company.toLowerCase().includes('it')) {
          category = 'IT/Software';
        } else if (company.toLowerCase().includes('bank') || company.toLowerCase().includes('finance')) {
          category = 'Banking';
        } else if (company.toLowerCase().includes('retail') || company.toLowerCase().includes('shop')) {
          category = 'Retail';
        } else if (company.toLowerCase().includes('manufacturing') || company.toLowerCase().includes('factory')) {
          category = 'Manufacturing';
        }
        
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
      return Object.entries(companyTypes).map(([name, value], index) => ({
        name,
        value: value as number,
        color: colors[index % colors.length]
      }));
    },
  });

  return {
    studentsCount: studentsQuery.data || 0,
    trainersCount: trainersQuery.data || 0,
    employeesCount: employeesQuery.data || 0,
    jobPlacements: jobApplicationsQuery.data || 0,
    incubationProjects: incubationProjectsQuery.data || 0,
    departmentData: departmentStatsQuery.data || [],
    placementData: placementDataQuery.data || [],
    loading: studentsQuery.isLoading || trainersQuery.isLoading || jobApplicationsQuery.isLoading || incubationProjectsQuery.isLoading,
  };
}
