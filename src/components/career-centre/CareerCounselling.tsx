
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, User, Clock, Filter } from 'lucide-react';
import { ScheduleSessionModal } from './ScheduleSessionModal';
import { SessionDetailsModal } from './SessionDetailsModal';

interface CareerCounsellingProps {
  detailed?: boolean;
}

export function CareerCounselling({ detailed = false }: CareerCounsellingProps) {
  // Mock sessions data with database integration structure
  const mockSessions = [
    {
      id: 1,
      studentName: 'John Doe',
      counselorName: 'Dr. Sarah Wilson',
      sessionType: 'Career Assessment',
      status: 'completed',
      date: '2024-01-15',
      duration: 60,
      notes: 'Initial career assessment completed. Student shows interest in technology sector.'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      counselorName: 'Prof. Michael Chen',
      sessionType: 'Goal Setting',
      status: 'scheduled',
      date: '2024-01-20',
      duration: 45,
      notes: 'Follow-up session to establish career goals and action plan.'
    },
    {
      id: 3,
      studentName: 'Alex Johnson',
      counselorName: 'Dr. Sarah Wilson',
      sessionType: 'Interview Preparation',
      status: 'in_progress',
      date: '2024-01-18',
      duration: 90,
      notes: 'Conducted mock interview session focusing on communication skills, technical knowledge assessment, and behavioral questions. Provided detailed feedback on areas of improvement.'
    }
  ];

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['career-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_counseling_sessions')
        .select('*')
        .order('session_date', { ascending: false })
        .limit(detailed ? 50 : 5);

      if (error) {
        console.error('Error fetching career sessions:', error);
        return mockSessions; // Fallback to mock data
      }
      return data?.length ? data : mockSessions; // Use mock data if no real data
    }
  });

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleViewDetails = (session: any) => {
    setSelectedSession(session);
    setDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Career Counselling Sessions
          </div>
          {detailed && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" onClick={() => setScheduleModalOpen(true)}>
                Schedule Session
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading sessions...
          </div>
        ) : (
          <div className="space-y-4">
            {sessions?.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{session.sessionType}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{session.studentName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Counselor: {session.counselorName}
                  </div>
                </div>
                <Badge className={getStatusColor(session.status)}>
                  {session.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{session.duration} minutes</span>
                </div>
              </div>

              {session.notes && (
                <p className="text-sm text-muted-foreground mb-3">{session.notes}</p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(session)}>
                  View Details
                </Button>
                {session.status === 'scheduled' && (
                  <Button size="sm">
                    Start Session
                  </Button>
                )}
                {detailed && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
              </div>
            </div>
            ))}
          </div>
        )}
      </CardContent>

      <ScheduleSessionModal 
        open={scheduleModalOpen} 
        onOpenChange={setScheduleModalOpen} 
      />
      
      <SessionDetailsModal 
        open={detailsModalOpen} 
        onOpenChange={setDetailsModalOpen} 
        session={selectedSession}
      />
    </Card>
  );
}
