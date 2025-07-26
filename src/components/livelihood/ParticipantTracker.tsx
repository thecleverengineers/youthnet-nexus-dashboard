
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
import { Users, Plus, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const ParticipantTracker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: participantProgress, isLoading } = useQuery({
    queryKey: ['participant-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participant_progress')
        .select(`
          *,
          livelihood_programs:program_id (
            program_name,
            focus_area
          )
        `)
        .order('milestone_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: programs } = useQuery({
    queryKey: ['livelihood-programs-for-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('livelihood_programs')
        .select('id, program_name')
        .order('program_name');

      if (error) throw error;
      return data || [];
    }
  });

  const createProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      const { data, error } = await supabase
        .from('participant_progress')
        .insert([progressData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participant-progress'] });
      setIsDialogOpen(false);
      toast.success('Progress record created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating progress record: ${error.message}`);
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, completion_percentage, status }: any) => {
      const { data, error } = await supabase
        .from('participant_progress')
        .update({ completion_percentage, status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participant-progress'] });
      toast.success('Progress updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const progressData = {
      program_id: formData.get('program_id') as string,
      participant_id: formData.get('participant_id') as string,
      milestone_name: formData.get('milestone_name') as string,
      milestone_date: formData.get('milestone_date') as string,
      completion_percentage: parseInt(formData.get('completion_percentage') as string),
      status: formData.get('status') as string,
      notes: formData.get('notes') as string
    };

    createProgressMutation.mutate(progressData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'at_risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Calculate summary stats
  const totalParticipants = [...new Set(participantProgress?.map(p => p.participant_id))].length;
  const avgCompletion = participantProgress?.reduce((sum, p) => sum + p.completion_percentage, 0) / (participantProgress?.length || 1);
  const completedMilestones = participantProgress?.filter(p => p.status === 'completed').length || 0;
  const atRiskCount = participantProgress?.filter(p => p.status === 'at_risk').length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-3xl font-bold text-primary">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
                <p className="text-3xl font-bold text-blue-600">{avgCompletion.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedMilestones}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-3xl font-bold text-red-600">{atRiskCount}</p>
              </div>
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Progress Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participant Progress Tracker
              </CardTitle>
              <CardDescription>Track program participants and their progress</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Progress
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Progress Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="program_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs?.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.program_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="participant_id"
                    placeholder="Participant ID"
                    required
                  />
                  
                  <Input
                    name="milestone_name"
                    placeholder="Milestone Name"
                    required
                  />
                  
                  <Input
                    name="milestone_date"
                    type="date"
                    required
                  />
                  
                  <Input
                    name="completion_percentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Completion Percentage"
                    required
                  />
                  
                  <Select name="status" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="at_risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    name="notes"
                    placeholder="Progress Notes"
                  />
                  
                  <Button type="submit" className="w-full">
                    Add Progress
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading participant progress...
            </div>
          ) : participantProgress?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No progress records found. Add one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participant</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Milestone</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participantProgress?.map((progress) => (
                  <TableRow key={progress.id}>
                    <TableCell className="font-medium">{progress.participant_id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{progress.livelihood_programs?.program_name}</div>
                        <div className="text-sm text-muted-foreground">{progress.livelihood_programs?.focus_area}</div>
                      </div>
                    </TableCell>
                    <TableCell>{progress.milestone_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(progress.completion_percentage)}`}
                            style={{ width: `${progress.completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{progress.completion_percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(progress.status)}>
                        {progress.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{progress.milestone_date ? new Date(progress.milestone_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateProgressMutation.mutate({
                            id: progress.id,
                            completion_percentage: Math.min(100, progress.completion_percentage + 10),
                            status: progress.completion_percentage >= 90 ? 'completed' : 'in_progress'
                          })}
                        >
                          +10%
                        </Button>
                      </div>
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
