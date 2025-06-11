
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Award, Users, Clock } from 'lucide-react';

interface PerformanceAnalyticsProps {
  detailed?: boolean;
}

export function PerformanceAnalytics({ detailed = false }: PerformanceAnalyticsProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['education-analytics'],
    queryFn: async () => {
      const [enrollmentsRes, completionsRes, programsRes] = await Promise.all([
        supabase.from('student_enrollments').select('status, enrollment_date'),
        supabase.from('student_enrollments').select('completion_date, grade').eq('status', 'completed'),
        supabase.from('training_programs').select('name, duration_weeks, status')
      ]);

      // Process data for charts
      const statusData = [
        { name: 'Active', value: enrollmentsRes.data?.filter(e => e.status === 'active').length || 0, color: '#22c55e' },
        { name: 'Completed', value: enrollmentsRes.data?.filter(e => e.status === 'completed').length || 0, color: '#3b82f6' },
        { name: 'Pending', value: enrollmentsRes.data?.filter(e => e.status === 'pending').length || 0, color: '#f59e0b' },
        { name: 'Dropped', value: enrollmentsRes.data?.filter(e => e.status === 'dropped').length || 0, color: '#ef4444' }
      ];

      const monthlyEnrollments = enrollmentsRes.data?.reduce((acc: any, enrollment) => {
        const month = new Date(enrollment.enrollment_date).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const enrollmentTrend = Object.entries(monthlyEnrollments || {}).map(([month, count]) => ({
        month,
        enrollments: count
      }));

      return {
        statusData,
        enrollmentTrend,
        totalEnrollments: enrollmentsRes.data?.length || 0,
        completionRate: enrollmentsRes.data?.length ? 
          Math.round((enrollmentsRes.data.filter(e => e.status === 'completed').length / enrollmentsRes.data.length) * 100) : 0,
        activePrograms: programsRes.data?.filter(p => p.status === 'active').length || 0
      };
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (detailed) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.totalEnrollments}</p>
                  <p className="text-sm text-muted-foreground">Total Enrollments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Award className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.completionRate}%</p>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics?.activePrograms}</p>
                  <p className="text-sm text-muted-foreground">Active Programs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {analytics?.statusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Enrollment Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics?.completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics?.activePrograms}</div>
            <div className="text-sm text-muted-foreground">Active Programs</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analytics?.statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
