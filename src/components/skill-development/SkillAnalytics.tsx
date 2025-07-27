
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { skillService } from '@/services/skillService';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';

export function SkillAnalytics() {
  useRealtimeUpdates();
  
  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery({
    queryKey: ['skill-assessments'],
    queryFn: () => skillService.getSkillAssessments()
  });

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: () => skillService.getCertifications()
  });

  // Process skill data
  const skillData = React.useMemo(() => {
    const skillMap = new Map();
    
    assessments.forEach(assessment => {
      const skill = assessment.skill_name;
      if (!skillMap.has(skill)) {
        skillMap.set(skill, { skill, assessments: 0, certifications: 0 });
      }
      skillMap.get(skill).assessments++;
    });

    certifications.forEach(cert => {
      cert.skills?.forEach(skill => {
        if (!skillMap.has(skill)) {
          skillMap.set(skill, { skill, assessments: 0, certifications: 0 });
        }
        skillMap.get(skill).certifications++;
      });
    });

    return Array.from(skillMap.values()).slice(0, 5);
  }, [assessments, certifications]);

  // Process completion data
  const completionData = React.useMemo(() => {
    const total = assessments.length;
    if (total === 0) return [];

    const completed = assessments.filter(a => a.status === 'completed').length;
    const inProgress = assessments.filter(a => a.status === 'in_progress').length;
    const pending = assessments.filter(a => a.status === 'pending').length;

    return [
      { name: 'Completed', value: Math.round((completed / total) * 100), color: 'hsl(var(--chart-1))' },
      { name: 'In Progress', value: Math.round((inProgress / total) * 100), color: 'hsl(var(--chart-2))' },
      { name: 'Pending', value: Math.round((pending / total) * 100), color: 'hsl(var(--chart-3))' }
    ];
  }, [assessments]);

  if (assessmentsLoading || certificationsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skill Analytics
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
