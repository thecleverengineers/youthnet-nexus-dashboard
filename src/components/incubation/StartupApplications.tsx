
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Eye, Check, X, Lightbulb } from 'lucide-react';
import { StartupForm } from './StartupForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export const StartupApplications = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['startup_applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startup_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('startup_applications')
        .update({ application_status: status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${status} successfully`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return <StartupForm onSuccess={() => { setShowForm(false); refetch(); }} onCancel={() => setShowForm(false)} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Startup Applications
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </CardTitle>
        <CardDescription>Review and manage startup incubation applications</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading applications...
          </div>
        ) : applications?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No applications found. Click "New Application" to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Team Size</TableHead>
                <TableHead>Funding Required</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.business_name}</TableCell>
                  <TableCell>{application.industry}</TableCell>
                  <TableCell>{application.team_size}</TableCell>
                  <TableCell>${application.funding_required}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.application_status)}>
                      {application.application_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(application.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {application.application_status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => updateStatus(application.id, 'approved')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => updateStatus(application.id, 'rejected')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
