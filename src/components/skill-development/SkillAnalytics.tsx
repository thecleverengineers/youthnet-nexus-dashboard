
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function SkillAnalytics() {
  const skillData = [
    { skill: 'Web Dev', assessments: 45, certifications: 12 },
    { skill: 'Marketing', assessments: 32, certifications: 8 },
    { skill: 'Data Science', assessments: 28, certifications: 6 },
    { skill: 'Design', assessments: 22, certifications: 5 },
    { skill: 'Business', assessments: 18, certifications: 4 }
  ];

  const completionData = [
    { name: 'Completed', value: 68, color: '#22c55e' },
    { name: 'In Progress', value: 25, color: '#3b82f6' },
    { name: 'Pending', value: 7, color: '#f59e0b' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Skill Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Skill Assessment Overview</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assessments" fill="#3b82f6" name="Assessments" />
                <Bar dataKey="certifications" fill="#22c55e" name="Certifications" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Completion Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {completionData.map((entry, index) => (
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
