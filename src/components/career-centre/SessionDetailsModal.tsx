import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Clock, MessageSquare } from 'lucide-react';

interface Session {
  id: number;
  studentName: string;
  counselorName: string;
  sessionType: string;
  status: string;
  date: string;
  duration: number;
  notes: string;
}

interface SessionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
}

export const SessionDetailsModal = ({ open, onOpenChange, session }: SessionDetailsModalProps) => {
  if (!session) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
          <DialogDescription>
            Detailed information about the counselling session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{session.sessionType}</h3>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Student:</span>
                    <span className="text-sm">{session.studentName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Counselor:</span>
                    <span className="text-sm">{session.counselorName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">{new Date(session.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{session.duration} minutes</span>
                  </div>
                </div>

                {session.notes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Notes:</span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {session.notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {session.status === 'scheduled' && (
              <Button>
                Start Session
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};