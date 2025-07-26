
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, Users, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { data: dashboards } = useQuery({
    queryKey: ['analytics-dashboards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_dashboards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch various analytics data
  const { data: studentsCount } = useQuery({
    queryKey: ['students-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: employeesCount } = useQuery({
    queryKey: ['employees-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: incubationProjects } = useQuery({
    queryKey: ['incubation-projects-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('incubation_projects')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: jobApplications } = useQuery({
    queryKey: ['job-applications-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', students: 45, employees: 12, projects: 8 },
    { month: 'Feb', students: 52, employees: 15, projects: 12 },
    { month: 'Mar', students: 48, employees: 18, projects: 15 },
    { month: 'Apr', students: 61, employees: 22, projects: 18 },
    { month: 'May', students: 55, employees: 25, projects: 22 },
    { month: 'Jun', students: 67, employees: 28, projects: 25 }
  ];

  const departmentData = [
    { department: 'Education', participants: studentsCount || 0 },
    { department: 'HR', participants: employeesCount || 0 },
    { department: 'Incubation', participants: incubationProjects || 0 },
    { department: 'Job Centre', participants: jobApplications || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-primary">{studentsCount}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-3xl font-bold text-blue-600">{employeesCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="text-3xl font-bold text-green-600">{incubationProjects}</p>
              </div>
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-3xl font-bold text-orange-600">{jobApplications}</p>
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
            <CardTitle>Monthly Growth Trends</CardTitle>
            <CardDescription>Participation across different programs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="employees" stroke="hsl(var(--secondary))" strokeWidth={2} />
                <Line type="monotone" dataKey="projects" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Current participation by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="participants" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Custom Dashboards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Custom Analytics Dashboards
          </CardTitle>
          <CardDescription>Saved dashboard configurations</CardDescription>
        </CardHeader>
        <CardContent>
          {!dashboards || dashboards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No custom dashboards found. Create one to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboards.map((dashboard) => (
                <Card key={dashboard.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{dashboard.name}</h3>
                      {dashboard.is_public && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Public</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {dashboard.description || 'No description available'}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Last refreshed: {dashboard.last_refreshed ? 
                        new Date(dashboard.last_refreshed).toLocaleDateString() : 
                        'Never'
                      }
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
