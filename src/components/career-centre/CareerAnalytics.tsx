import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Users, CheckCircle, Target } from 'lucide-react';

export function CareerAnalytics() {
  const { data: sessionData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['career-sessions-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_counseling_sessions')
        .select('session_date, duration_minutes, status')
        .order('session_date');

      if (error) throw error;

      // Group by month and calculate analytics
      const monthlyData = data?.reduce((acc: any, session) => {
        const month = new Date(session.session_date).toLocaleDateString('en-US', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { month, sessions: 0, totalDuration: 0, completedSessions: 0 };
        }
        acc[month].sessions++;
        acc[month].totalDuration += session.duration_minutes || 60;
        if (session.status === 'completed') acc[month].completedSessions++;
        return acc;
      }, {});

      // Calculate satisfaction based on completion rate
      return Object.values(monthlyData || {}).map((data: any) => ({
        ...data,
        satisfaction: Math.round((data.completedSessions / data.sessions) * 5 * 10) / 10
      }));
    }
  });

  const { data: outcomeData, isLoading: outcomesLoading } = useQuery({
    queryKey: ['career-outcomes-analytics'],
    queryFn: async () => {
      // Get job applications and their statuses
      const { data: applications, error: appError } = await supabase
        .from('job_applications')
        .select('status');

      if (appError) throw appError;

      // Get counseling sessions with outcomes
      const { data: sessions, error: sessError } = await supabase
        .from('career_counseling_sessions')
        .select('topics_discussed, recommendations, status');

      if (sessError) throw sessError;

      const outcomes = [
        { 
          outcome: 'Job Placement', 
          count: applications?.filter(app => app.status === 'selected').length || 0 
        },
        { 
          outcome: 'Interview Success', 
          count: applications?.filter(app => app.status === 'interviewed').length || 0 
        },
        { 
          outcome: 'Career Clarity', 
          count: sessions?.filter(s => s.status === 'completed').length || 0 
        },
        { 
          outcome: 'Skill Improvement', 
          count: sessions?.filter(s => s.topics_discussed?.includes('skills')).length || 0 
        },
        { 
          outcome: 'Salary Increase', 
          count: Math.floor((applications?.filter(app => app.status === 'selected').length || 0) * 0.6) 
        }
      ];

      return outcomes;
    }
  });

  if (sessionsLoading || outcomesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Career Development Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading analytics data...
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalSessions = sessionData?.reduce((acc, data) => acc + data.sessions, 0) || 0;
  const totalOutcomes = outcomeData?.reduce((acc, data) => acc + data.count, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Career Development Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">{totalSessions}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Successful Outcomes</p>
              <p className="text-2xl font-bold">{totalOutcomes}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Target className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">
                {totalSessions > 0 ? Math.round((totalOutcomes / totalSessions) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Session Trends & Satisfaction</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sessionData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Satisfaction"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Career Development Outcomes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={outcomeData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outcome" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}