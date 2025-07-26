
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const FundingTracker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: fundingApplications, isLoading } = useQuery({
    queryKey: ['funding-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funding_applications')
        .select('*')
        .order('application_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: startups } = useQuery({
    queryKey: ['startups-for-funding'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incubation_projects')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (applicationData: any) => {
      const { data, error } = await supabase
        .from('funding_applications')
        .insert([applicationData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funding-applications'] });
      setIsDialogOpen(false);
      toast.success('Funding application created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating application: ${error.message}`);
    }
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, amount_approved, notes }: any) => {
      const updateData: any = { status };
      if (amount_approved) updateData.amount_approved = amount_approved;
      if (notes) updateData.notes = notes;
      if (status === 'approved') updateData.decision_date = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('funding_applications')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funding-applications'] });
      toast.success('Application updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const applicationData = {
      startup_id: formData.get('startup_id') as string,
      funding_type: formData.get('funding_type') as string,
      purpose: formData.get('purpose') as string,
      amount_requested: parseFloat(formData.get('amount_requested') as string),
      application_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    createApplicationMutation.mutate(applicationData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const totalRequested = fundingApplications?.reduce((sum, app) => sum + app.amount_requested, 0) || 0;
  const totalApproved = fundingApplications?.reduce((sum, app) => sum + (app.amount_approved || 0), 0) || 0;
  const pendingCount = fundingApplications?.filter(app => app.status === 'pending').length || 0;
  const approvedCount = fundingApplications?.filter(app => app.status === 'approved').length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requested</p>
                <p className="text-3xl font-bold text-primary">₹{totalRequested.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Approved</p>
                <p className="text-3xl font-bold text-green-600">₹{totalApproved.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-blue-600">{approvedCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Funding Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Funding Applications
              </CardTitle>
              <CardDescription>Track funding applications and disbursements</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Application
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Funding Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="startup_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Startup" />
                    </SelectTrigger>
                    <SelectContent>
                      {startups?.map(startup => (
                        <SelectItem key={startup.id} value={startup.id}>
                          {startup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select name="funding_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Funding Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seed">Seed Funding</SelectItem>
                      <SelectItem value="series_a">Series A</SelectItem>
                      <SelectItem value="series_b">Series B</SelectItem>
                      <SelectItem value="grant">Grant</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="amount_requested"
                    type="number"
                    placeholder="Amount Requested"
                    required
                  />
                  
                  <Textarea
                    name="purpose"
                    placeholder="Purpose of funding"
                    required
                  />
                  
                  <Button type="submit" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading funding applications...
            </div>
          ) : fundingApplications?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No funding applications found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundingApplications?.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">Startup ID: {application.startup_id}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-40">
                          {application.purpose}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {application.funding_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{application.amount_requested.toLocaleString()}</TableCell>
                    <TableCell>
                      {application.amount_approved ? 
                        `₹${application.amount_approved.toLocaleString()}` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>{new Date(application.application_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {application.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateApplicationMutation.mutate({
                              id: application.id,
                              status: 'approved',
                              amount_approved: application.amount_requested
                            })}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationMutation.mutate({
                              id: application.id,
                              status: 'rejected'
                            })}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
