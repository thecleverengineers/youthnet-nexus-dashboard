
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GraduationCap, Users, BookOpen, TrendingUp } from 'lucide-react';

export const EducationAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['education-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_analytics')
        .select('*')
        .order('period_start', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: departmentStats } = useQuery({
    queryKey: ['department-stats'],
    queryFn: async () => {
      const [courses, students, instructors] = await Promise.all([
        supabase.from('education_courses').select('count', { count: 'exact' }),
        supabase.from('students').select('count', { count: 'exact' }),
        supabase.from('instructors').select('count', { count: 'exact' })
      ]);

      return {
        totalCourses: courses.count || 0,
        totalStudents: students.count || 0,
        totalInstructors: instructors.count || 0,
        completionRate: 85 // This would be calculated from actual completion data
      };
    }
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const chartData = analytics?.map(item => ({
    department: item.department_id,
    value: item.metric_value,
    type: item.metric_type
  })) || [];

  const departmentData = analytics?.reduce((acc, item) => {
    if (!acc[item.department_id]) {
      acc[item.department_id] = 0;
    }
    acc[item.department_id] += item.metric_value;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(departmentData || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold text-primary">{departmentStats?.totalCourses || 0}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{departmentStats?.totalStudents || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Instructors</p>
                <p className="text-3xl font-bold text-green-600">{departmentStats?.totalInstructors || 0}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-3xl font-bold text-orange-600">{departmentStats?.completionRate || 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Metrics by department over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading analytics...</div>
            ) : chartData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No analytics data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Performance distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No distribution data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
