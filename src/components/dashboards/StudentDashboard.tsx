
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User,
  BookOpen,
  Award,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseHelpers, Student, StudentEnrollment } from '@/utils/supabaseHelpers';

export const StudentDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStudentData();
    }
  }, [user]);

  const loadStudentData = async () => {
    try {
      // Fetch student record
      const { data: student } = await supabaseHelpers.students
        .select('*')
        .eq('user_id', user.id)
        .single();

      setStudentData(student);

      // Fetch enrollments
      const { data: enrollmentData } = await supabaseHelpers.student_enrollments
        .select(`
          *,
          training_programs(name, duration_weeks)
        `)
        .eq('student_id', student?.id);

      setEnrollments(enrollmentData || []);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome, {profile?.full_name}!</h1>
                  <p className="text-muted-foreground">Student ID: {studentData?.student_id}</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">
                    Student
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={signOut} className="hover:bg-red-500/20">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold text-white">{enrollments.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-400">
                    {enrollments.filter(e => e.status === 'completed').length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {enrollments.filter(e => e.status === 'active').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold text-purple-400">75%</p>
                  <Progress value={75} className="mt-2" />
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Enrollments */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              Your Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">
                          {enrollment.training_programs?.name || 'Course'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Duration: {enrollment.training_programs?.duration_weeks} weeks
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={
                          enrollment.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          enrollment.status === 'active' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {enrollment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No courses enrolled yet</p>
                <Button className="mt-4">Browse Courses</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
