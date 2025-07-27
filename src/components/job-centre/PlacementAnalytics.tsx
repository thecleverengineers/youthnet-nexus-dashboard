import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function PlacementAnalytics() {
  const { data: placementData = [] } = useQuery({
    queryKey: ['placement-monthly-data'],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const [applicationsRes, placementsRes] = await Promise.all([
        supabase
          .from('job_applications')
          .select('created_at, status')
          .gte('created_at', sixMonthsAgo.toISOString()),
        supabase
          .from('job_applications')
          .select('created_at')
          .eq('status', 'selected')
          .gte('created_at', sixMonthsAgo.toISOString())
      ]);

      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const applications = applicationsRes.data?.filter(app => {
          const createdAt = new Date(app.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;

        const placements = placementsRes.data?.filter(app => {
          const createdAt = new Date(app.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;

        months.push({ month: monthKey, placements, applications });
      }

      return months;
    }
  });

  const { data: industryData = [] } = useQuery({
    queryKey: ['industry-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('job_type')
        .eq('status', 'open');

      if (error) throw error;

      const industryMap = (data || []).reduce((acc: Record<string, number>, job) => {
        const industry = job.job_type || 'Others';
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {});

      const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
      
      return Object.entries(industryMap).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Placement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Placement Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="placements" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Placements"
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Industry Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}