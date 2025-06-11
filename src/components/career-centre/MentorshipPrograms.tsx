
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Target, Calendar, Award, Plus } from 'lucide-react';

interface MentorshipProgramsProps {
  detailed?: boolean;
}

export function MentorshipPrograms({ detailed = false }: MentorshipProgramsProps) {
  const [programs] = useState([
    {
      id: 1,
      title: 'Tech Career Mentorship',
      mentor: 'John Senior Developer',
      mentee: 'Alice Johnson',
      progress: 75,
      duration: '6 months',
      status: 'active',
      startDate: '2024-01-01',
      goals: ['Technical Skills', 'Interview Prep', 'Portfolio Building']
    },
    {
      id: 2,
      title: 'Business Leadership Track',
      mentor: 'Sarah Business Consultant',
      mentee: 'Bob Wilson',
      progress: 45,
      duration: '4 months',
      status: 'active',
      startDate: '2024-01-15',
      goals: ['Leadership Skills', 'Strategic Thinking', 'Networking']
    },
    {
      id: 3,
      title: 'Creative Industries Mentorship',
      mentor: 'Maria Design Director',
      mentee: 'Charlie Brown',
      progress: 90,
      duration: '3 months',
      status: 'completing',
      startDate: '2023-11-01',
      goals: ['Portfolio Development', 'Client Relations', 'Creative Process']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mentorship Programs
          </div>
          {detailed && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Program
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {programs.map((program) => (
            <div key={program.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{program.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    <div>Mentor: {program.mentor}</div>
                    <div>Mentee: {program.mentee}</div>
                  </div>
                </div>
                <Badge className={getStatusColor(program.status)}>
                  {program.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{program.progress}%</span>
                </div>
                <Progress value={program.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {program.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>Started: {new Date(program.startDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Goals:</div>
                <div className="flex flex-wrap gap-1">
                  {program.goals.map((goal, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Progress
                </Button>
                <Button variant="outline" size="sm">
                  Schedule Meeting
                </Button>
                {detailed && (
                  <Button size="sm">
                    Manage Program
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
