import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEducationAnalytics() {
  const enrollmentTrendsQuery = useQuery({
    queryKey: ['education-enrollment-trends'],
    queryFn: async () => {
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select(`
          enrollment_date,
          status,
          training_programs(name)
        `)
        .order('enrollment_date', { ascending: true });

      // Group by month for trend analysis
      const monthlyData = enrollments?.reduce((acc: any[], enrollment) => {
        const month = new Date(enrollment.enrollment_date).toLocaleString('default', { month: 'short', year: '2-digit' });
        const existing = acc.find(item => item.month === month);
        
        if (existing) {
          existing.enrollments += 1;
          if (enrollment.status === 'completed') existing.completions += 1;
        } else {
          acc.push({
            month,
            enrollments: 1,
            completions: enrollment.status === 'completed' ? 1 : 0
          });
        }
        return acc;
      }, []) || [];

      return monthlyData.slice(-6); // Last 6 months
    },
  });

  const performanceStatsQuery = useQuery({
    queryKey: ['education-performance-stats'],
    queryFn: async () => {
      const { data: students } = await supabase
        .from('students')
        .select('*');

      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select('status');

      const totalStudents = students?.length || 0;
      const activeEnrollments = enrollments?.filter(e => e.status === 'active').length || 0;
      const completedPrograms = enrollments?.filter(e => e.status === 'completed').length || 0;
      const completionRate = enrollments?.length ? Math.round((completedPrograms / enrollments.length) * 100) : 0;

      return {
        totalStudents,
        activeEnrollments,
        completedPrograms,
        completionRate
      };
    },
  });

  const programPopularityQuery = useQuery({
    queryKey: ['education-program-popularity'],
    queryFn: async () => {
      const { data } = await supabase
        .from('student_enrollments')
        .select(`
          training_programs(name),
          status
        `);

      const programStats = data?.reduce((acc: any[], enrollment) => {
        const programName = enrollment.training_programs?.name || 'Unknown Program';
        const existing = acc.find(item => item.name === programName);
        
        if (existing) {
          existing.enrollments += 1;
          if (enrollment.status === 'completed') existing.completions += 1;
        } else {
          acc.push({
            name: programName,
            enrollments: 1,
            completions: enrollment.status === 'completed' ? 1 : 0,
            completionRate: 0
          });
        }
        return acc;
      }, []) || [];

      // Calculate completion rates
      return programStats.map(program => ({
        ...program,
        completionRate: Math.round((program.completions / program.enrollments) * 100)
      })).sort((a, b) => b.enrollments - a.enrollments);
    },
  });

  return {
    enrollmentTrends: enrollmentTrendsQuery.data || [],
    performanceStats: performanceStatsQuery.data || {
      totalStudents: 0,
      activeEnrollments: 0,
      completedPrograms: 0,
      completionRate: 0
    },
    programPopularity: programPopularityQuery.data || [],
    loading: enrollmentTrendsQuery.isLoading || performanceStatsQuery.isLoading || programPopularityQuery.isLoading,
  };
}