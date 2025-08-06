import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useEducationAnalytics() {
  const enrollmentTrendsQuery = useQuery({
    queryKey: ['education-enrollment-trends'],
    queryFn: async () => {
      // Mock data since student_enrollments table doesn't exist
      const currentMonth = new Date().getMonth();
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const month = new Date();
        month.setMonth(currentMonth - (5 - i));
        return {
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          enrollments: Math.floor(Math.random() * 30) + 15,
          completions: Math.floor(Math.random() * 20) + 10,
        };
      });

      return monthlyData;
    },
  });

  const performanceStatsQuery = useQuery({
    queryKey: ['education-performance-stats'],
    queryFn: async () => {
      // Get actual profiles count for student role
      const { data: students } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      const totalStudents = students?.length || 0;
      const activeEnrollments = Math.floor(totalStudents * 0.85);
      const completedPrograms = Math.floor(totalStudents * 0.6);
      const completionRate = totalStudents ? Math.round((completedPrograms / totalStudents) * 100) : 0;

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
      // Mock program popularity data
      return [
        { name: 'Web Development', enrollments: 45, completions: 38, completionRate: 84 },
        { name: 'Digital Marketing', enrollments: 32, completions: 28, completionRate: 88 },
        { name: 'Data Science', enrollments: 28, completions: 22, completionRate: 79 },
        { name: 'Mobile App Development', enrollments: 35, completions: 30, completionRate: 86 },
        { name: 'UI/UX Design', enrollments: 25, completions: 22, completionRate: 88 },
      ];
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