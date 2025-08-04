
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, Search, Plus } from 'lucide-react';

export function TrainingPlans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingPlans] = useState([
    {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Complete course covering frontend and backend development',
      duration: '12 weeks',
      participants: 25,
      maxParticipants: 30,
      progress: 60,
      status: 'active',
      startDate: '2024-01-01',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript']
    },
    {
      id: 2,
      title: 'Digital Marketing Fundamentals',
      description: 'Learn the basics of digital marketing and social media',
      duration: '8 weeks',
      participants: 18,
      maxParticipants: 20,
      progress: 75,
      status: 'active',
      startDate: '2024-01-15',
      skills: ['SEO', 'Social Media', 'Content Marketing', 'Analytics']
    },
    {
      id: 3,
      title: 'Data Science with Python',
      description: 'Comprehensive data science and machine learning course',
      duration: '16 weeks',
      participants: 15,
      maxParticipants: 20,
      progress: 30,
      status: 'active',
      startDate: '2024-02-01',
      skills: ['Python', 'Pandas', 'Machine Learning', 'Statistics']
    }
  ]);

  const filteredPlans = trainingPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Training Plans
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search training plans or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{plan.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{plan.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge className={getStatusColor(plan.status)}>
                  {plan.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{plan.participants}/{plan.maxParticipants}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Start: </span>
                  {new Date(plan.startDate).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Progress: </span>
                  {plan.progress}%
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Manage Participants
                </Button>
                <Button size="sm">
                  Edit Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
