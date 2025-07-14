
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  Target
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Layout } from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const { userSpecificData, isLoading } = useDashboardData();

  // Fetch student's current enrollments
  const { data: enrollments } = useQuery({
    queryKey: ['student-enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!student) return [];

      const { data } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          education_courses(*)
        `)
        .eq('student_id', student.id);
      
      return data || [];
    },
    enabled: !!user
  });

  // Fetch student's certifications
  const { data: certifications } = useQuery({
    queryKey: ['student-certifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!student) return [];

      const { data } = await supabase
        .from('certifications')
        .select('*')
        .eq('student_id', student.id);
      
      return data || [];
    },
    enabled: !!user
  });

  // Fetch available training programs
  const { data: availablePrograms } = useQuery({
    queryKey: ['available-programs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('training_programs')
        .select('*')
        .eq('status', 'active')
        .limit(5);
      
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const activeEnrollments = enrollments?.filter(e => e.status === 'enrolled') || [];
  const completedCourses = enrollments?.filter(e => e.status === 'completed') || [];
  const inProgressCertifications = certifications?.filter(c => c.status === 'in_progress') || [];
  const completedCertifications = certifications?.filter(c => c.status === 'completed') || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'Student'}!</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Courses
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEnrollments.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently enrolled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Courses finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCertifications.length}</div>
              <p className="text-xs text-muted-foreground">
                Earned certificates
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
                {activeEnrollments.length + completedCourses.length > 0 
                  ? Math.round((completedCourses.length / (activeEnrollments.length + completedCourses.length)) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Courses</CardTitle>
              <CardDescription>Your active enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeEnrollments.length === 0 ? (
                  <div className="text-center py-6">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No active courses</p>
                    <Button className="mt-2" size="sm">Enroll in a Course</Button>
                  </div>
                ) : (
                  activeEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{enrollment.education_courses?.course_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.education_courses?.course_code}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {enrollment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {enrollment.education_courses?.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="flex justify-between mt-3">
                        <span className="text-sm text-muted-foreground">
                          Duration: {enrollment.education_courses?.duration_months} months
                        </span>
                        <Button size="sm" variant="outline">Continue</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Your achievements and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications?.length === 0 ? (
                  <div className="text-center py-6">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No certifications yet</p>
                    <Button className="mt-2" size="sm">Start Certification</Button>
                  </div>
                ) : (
                  certifications?.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Issued by {cert.issuer}
                          </p>
                        </div>
                        <Badge 
                          variant={cert.status === 'completed' ? 'default' : 'secondary'}
                          className={cert.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
                        >
                          {cert.status}
                        </Badge>
                      </div>
                      {cert.status === 'in_progress' && (
                        <div className="space-y-2 mt-3">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{cert.progress}%</span>
                          </div>
                          <Progress value={cert.progress} className="h-2" />
                        </div>
                      )}
                      {cert.issue_date && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Programs */}
        <Card>
          <CardHeader>
            <CardTitle>Available Training Programs</CardTitle>
            <CardDescription>Explore new learning opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePrograms?.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-6">
                  No programs available at this time
                </p>
              ) : (
                availablePrograms?.map((program) => (
                  <div key={program.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{program.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {program.description}
                    </p>
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-muted-foreground">
                        {program.duration_weeks} weeks
                      </span>
                      <span className="text-muted-foreground">
                        Max {program.max_participants} students
                      </span>
                    </div>
                    <Button size="sm" className="w-full">
                      Learn More
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
