
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function CareerAnalytics() {
  const sessionData = [
    { month: 'Jan', sessions: 35, satisfaction: 4.2 },
    { month: 'Feb', sessions: 42, satisfaction: 4.4 },
    { month: 'Mar', sessions: 38, satisfaction: 4.3 },
    { month: 'Apr', sessions: 45, satisfaction: 4.5 },
    { month: 'May', sessions: 52, satisfaction: 4.6 },
    { month: 'Jun', sessions: 48, satisfaction: 4.7 }
  ];

  const outcomeData = [
    { outcome: 'Job Placement', count: 45 },
    { outcome: 'Skill Improvement', count: 78 },
    { outcome: 'Career Clarity', count: 92 },
    { outcome: 'Interview Success', count: 56 },
    { outcome: 'Salary Increase', count: 23 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Career Development Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Session Trends & Satisfaction</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sessionData}>
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
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Satisfaction"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Career Outcomes</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outcome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
