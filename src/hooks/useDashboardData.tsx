
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useDashboardData() {
  const { user, profile } = useAuth();

  // General statistics query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [
        studentsRes,
        employeesRes,
        programsRes,
        jobsRes,
        projectsRes,
        inventoryRes
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }),
        supabase.from('job_postings').select('*', { count: 'exact', head: true }).eq('status', 'open'),
        supabase.from('incubation_projects').select('*', { count: 'exact', head: true }),
        supabase.from('inventory_items').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalStudents: studentsRes.count || 0,
        totalEmployees: employeesRes.count || 0,
        totalPrograms: programsRes.count || 0,
        activeJobs: jobsRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalAssets: inventoryRes.count || 0
      };
    },
    enabled: !!user
  });

  // User-specific data based on role
  const { data: userSpecificData, isLoading: userDataLoading } = useQuery({
    queryKey: ['user-specific-data', profile?.role, user?.id],
    queryFn: async () => {
      if (!user || !profile) return null;

      switch (profile.role) {
        case 'student':
          const { data: studentData } = await supabase
            .from('students')
            .select(`
              *,
              student_enrollments(
                *,
                training_programs(name)
              ),
              certifications(*),
              job_applications(*)
            `)
            .eq('user_id', user.id)
            .single();
          return studentData;

        case 'trainer':
          const { data: trainerData } = await supabase
            .from('trainers')
            .select(`
              *,
              training_programs(*)
            `)
            .eq('user_id', user.id)
            .single();
          return trainerData;

        case 'staff':
        case 'admin':
          const { data: employeeData } = await supabase
            .from('employees')
            .select(`
              *,
              employee_tasks(*),
              attendance_records(*)
            `)
            .eq('user_id', user.id)
            .single();
          return employeeData;

        default:
          return null;
      }
    },
    enabled: !!user && !!profile
  });

  // Recent activities
  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const activities = [];

      // Get recent job applications
      const { data: jobApps } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings(title, company),
          students!inner(user_id, profiles!inner(full_name))
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (jobApps) {
        activities.push(...jobApps.map(app => ({
          id: app.id,
          type: 'job_application',
          title: `Job Application: ${app.job_postings?.title}`,
          description: `${app.students?.profiles?.full_name} applied to ${app.job_postings?.company}`,
          timestamp: app.created_at
        })));
      }

      // Get recent enrollments
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          training_programs(name),
          students!inner(user_id, profiles!inner(full_name))
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (enrollments) {
        activities.push(...enrollments.map(enrollment => ({
          id: enrollment.id,
          type: 'enrollment',
          title: `New Enrollment: ${enrollment.training_programs?.name}`,
          description: `${enrollment.students?.profiles?.full_name} enrolled in program`,
          timestamp: enrollment.created_at
        })));
      }

      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
    enabled: !!user
  });

  return {
    stats,
    userSpecificData,
    recentActivities,
    isLoading: statsLoading || userDataLoading || activitiesLoading,
    profile
  };
}
