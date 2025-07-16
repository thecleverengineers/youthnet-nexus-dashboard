
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function StudentDashboard() {
  const { user, profile } = useAuth();

  const { data: studentData } = useQuery({
    queryKey: ['student-data', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: studentRecord } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!studentRecord) return null;

      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          training_programs (
            name,
            description,
            duration_weeks
          )
        `)
        .eq('student_id', studentRecord.id);

      const { data: courseEnrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          education_courses (
            course_name,
            description,
            duration_months
          )
        `)
        .eq('student_id', studentRecord.id);

      return {
        student: studentRecord,
        enrollments: enrollments || [],
        courseEnrollments: courseEnrollments || []
      };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const student = studentData?.student;
  const enrollments = studentData?.enrollments || [];
  const courseEnrollments = studentData?.courseEnrollments || [];
  const allEnrollments = [...enrollments, ...courseEnrollments];

  const activeCount = allEnrollments.filter(e => 
    e.status === 'active' || e.status === 'enrolled'
  ).length;
  
  const completedCount = allEnrollments.filter(e => 
    e.status === 'completed'
  ).length;

  const progressPercentage = allEnrollments.length > 0 
    ? Math.round((completedCount / allEnrollments.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome Back, {profile?.full_name || 'Student'}!</h1>
        <p className="opacity-90">Student ID: {student?.student_id || 'Loading...'}</p>
        <p className="opacity-90">Status: {student?.status || 'Active'}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">
              Current programs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Programs finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Overall completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>My Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {allEnrollments.length > 0 ? (
            <div className="space-y-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">
                      {enrollment.training_programs?.name || 'Training Program'}
                    </h3>
                    <Badge variant={enrollment.status === 'active' ? 'default' : 
                            enrollment.status === 'completed' ? 'secondary' : 'destructive'}>
                      {enrollment.status}
                    </Badge>
                  </div>
                  {enrollment.training_programs?.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {enrollment.training_programs.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </div>
                    {enrollment.training_programs?.duration_weeks && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {enrollment.training_programs.duration_weeks} weeks
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {courseEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">
                      {enrollment.education_courses?.course_name || 'Education Course'}
                    </h3>
                    <Badge variant={enrollment.status === 'enrolled' ? 'default' : 
                            enrollment.status === 'completed' ? 'secondary' : 'destructive'}>
                      {enrollment.status}
                    </Badge>
                  </div>
                  {enrollment.education_courses?.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {enrollment.education_courses.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </div>
                    {enrollment.education_courses?.duration_months && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {enrollment.education_courses.duration_months} months
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Enrollments Yet</h3>
              <p className="text-gray-600">
                You haven't enrolled in any programs yet. Contact your advisor to get started!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
