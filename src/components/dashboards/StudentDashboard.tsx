
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, Award, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;

    try {
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentData) {
        setStudent(studentData);

        const { data: enrollmentData } = await supabase
          .from('student_enrollments')
          .select(`
            *,
            training_programs (
              name,
              description,
              duration_weeks
            )
          `)
          .eq('student_id', studentData.id);

        setEnrollments(enrollmentData || []);
      }
    } catch (error) {
      console.error('Error in fetchStudentData:', error);
    }
  };

  // Show dashboard immediately with default content
  const displayStudent = student || { student_id: 'Loading...', status: 'active' };
  const displayEnrollments = enrollments.length > 0 ? enrollments : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome Back, Student!</h1>
        <p className="opacity-90">Student ID: {displayStudent.student_id}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {displayEnrollments.filter(e => e.status === 'active').length}
            </div>
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
            <div className="text-2xl font-bold">
              {displayEnrollments.filter(e => e.status === 'completed').length}
            </div>
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
            <div className="text-2xl font-bold">
              {displayEnrollments.length > 0 
                ? Math.round((displayEnrollments.filter(e => e.status === 'completed').length / displayEnrollments.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>My Training Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {displayEnrollments.length > 0 ? (
            <div className="space-y-4">
              {displayEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">
                      {enrollment.training_programs?.name || 'Program Name'}
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
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Enrollments Yet</h3>
              <p className="text-gray-600">
                You haven't enrolled in any training programs yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
