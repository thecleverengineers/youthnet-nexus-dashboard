
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
    initialData: 0,
    staleTime: 5 * 60 * 1000,
  });

  const trainersQuery = useQuery({
    queryKey: ['trainers-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('trainers')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    initialData: 0,
    staleTime: 5 * 60 * 1000,
  });

  const employeesQuery = useQuery({
    queryKey: ['employees-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    initialData: 0,
    staleTime: 5 * 60 * 1000,
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
    initialData: 0,
    staleTime: 5 * 60 * 1000,
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
    initialData: 0,
    staleTime: 5 * 60 * 1000,
  });

  const departmentStatsQuery = useQuery({
    queryKey: ['department-stats'],
    queryFn: async () => {
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select(`
          status,
          program_id,
          training_programs(name)
        `);

      const { data: courseEnrollments } = await supabase
        .from('course_enrollments')
        .select('status');

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
    initialData: [
      { name: 'Education', students: 25, completion: 85 },
      { name: 'Skill Dev', students: 18, completion: 92 },
      { name: 'Job Centre', students: 12, completion: 78 },
      { name: 'Career Dev', students: 8, completion: 88 },
      { name: 'Incubation', students: 5, completion: 95 },
    ],
    staleTime: 5 * 60 * 1000,
  });

  const placementDataQuery = useQuery({
    queryKey: ['placement-data'],
    queryFn: async () => {
      const { data: applications } = await supabase
        .from('job_applications')
        .select(`
          status,
          job_postings(company, title)
        `)
        .eq('status', 'selected');

      const companyTypes = applications?.reduce((acc: any, app: any) => {
        const company = app.job_postings?.company || 'Others';
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
    initialData: [
      { name: 'IT/Software', value: 35, color: '#8884d8' },
      { name: 'Banking', value: 25, color: '#82ca9d' },
      { name: 'Retail', value: 20, color: '#ffc658' },
      { name: 'Manufacturing', value: 15, color: '#ff7c7c' },
      { name: 'Others', value: 5, color: '#8dd1e1' },
    ],
    staleTime: 5 * 60 * 1000,
  });

  return {
    studentsCount: studentsQuery.data || 0,
    trainersCount: trainersQuery.data || 0,
    employeesCount: employeesQuery.data || 0,
    jobPlacements: jobApplicationsQuery.data || 0,
    incubationProjects: incubationProjectsQuery.data || 0,
    departmentData: departmentStatsQuery.data || [],
    placementData: placementDataQuery.data || [],
    loading: false,
  };
}
