
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, User, Calendar, MessageSquare, Filter } from 'lucide-react';

interface ApplicationTrackingProps {
  detailed?: boolean;
}

export function ApplicationTracking({ detailed = false }: ApplicationTrackingProps) {
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['job-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_postings:job_id (
            title,
            company
          ),
          students:student_id (
            student_id,
            profiles:user_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(detailed ? 50 : 10);

      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'selected': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications?.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  ) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Tracking
          </div>
          {detailed && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {detailed && (
          <div className="mb-4 flex gap-2 flex-wrap">
            {['all', 'pending', 'shortlisted', 'interviewed', 'selected', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications found
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">
                      {application.job_postings?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {application.job_postings?.company}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {application.students?.profiles?.full_name}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                  </div>
                  {application.interview_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Interview: {new Date(application.interview_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {application.notes && (
                  <div className="mb-3">
                    <p className="text-sm text-muted-foreground">{application.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  {detailed && (
                    <Button size="sm">
                      Update Status
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
