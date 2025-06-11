
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SkillAssessmentProps {
  detailed?: boolean;
}

export function SkillAssessment({ detailed = false }: SkillAssessmentProps) {
  const [assessments] = useState([
    {
      id: 1,
      skill: 'Web Development',
      level: 'Intermediate',
      progress: 75,
      status: 'in_progress',
      lastAssessed: '2024-01-15',
      nextAssessment: '2024-02-15'
    },
    {
      id: 2,
      skill: 'Digital Marketing',
      level: 'Beginner',
      progress: 40,
      status: 'pending',
      lastAssessed: '2024-01-10',
      nextAssessment: '2024-02-10'
    },
    {
      id: 3,
      skill: 'Data Analysis',
      level: 'Advanced',
      progress: 90,
      status: 'completed',
      lastAssessed: '2024-01-20',
      nextAssessment: '2024-03-20'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Skill Assessments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(assessment.status)}
                  <h3 className="font-medium">{assessment.skill}</h3>
                </div>
                <Badge className={getStatusColor(assessment.status)}>
                  {assessment.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{assessment.progress}%</span>
                </div>
                <Progress value={assessment.progress} className="h-2" />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Level: {assessment.level}</span>
                <span>Next: {new Date(assessment.nextAssessment).toLocaleDateString()}</span>
              </div>

              {detailed && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm">
                    Start Assessment
                  </Button>
                </div>
              )}
            </div>
          ))}

          {detailed && (
            <Button className="w-full mt-4">
              Create New Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
