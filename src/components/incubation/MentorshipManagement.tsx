
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
import { Users, Plus, UserCheck, Calendar, Star } from 'lucide-react';
import { toast } from 'sonner';

export const MentorshipManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: mentorAssignments, isLoading } = useQuery({
    queryKey: ['mentor-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentor_assignments')
        .select(`
          *,
          mentors:mentor_id (
            name,
            expertise_areas,
            company_affiliation
          ),
          incubation_projects:incubation_project_id (
            name,
            description
          )
        `)
        .order('assignment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: mentors } = useQuery({
    queryKey: ['available-mentors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mentors')
        .select('id, name, expertise_areas, current_mentees, mentorship_capacity')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['incubation-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incubation_projects')
        .select('id, name, description')
        .in('status', ['idea', 'development', 'testing'])
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: any) => {
      const { data, error } = await supabase
        .from('mentor_assignments')
        .insert([assignmentData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-assignments'] });
      setIsDialogOpen(false);
      toast.success('Mentorship assignment created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating assignment: ${error.message}`);
    }
  });

  const updateAssignmentMutation = useMutation({
    mutationFn: async ({ id, status }: any) => {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.end_date = new Date().toISOString().split('T')[0];
      }
      
      const { data, error } = await supabase
        .from('mentor_assignments')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-assignments'] });
      toast.success('Assignment updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assignmentData = {
      mentor_id: formData.get('mentor_id') as string,
      incubation_project_id: formData.get('project_id') as string,
      assignment_date: new Date().toISOString().split('T')[0],
      meeting_frequency: formData.get('meeting_frequency') as string,
      goals: (formData.get('goals') as string).split(',').map(g => g.trim()).filter(g => g),
      status: 'active'
    };

    createAssignmentMutation.mutate(assignmentData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const activeAssignments = mentorAssignments?.filter(a => a.status === 'active').length || 0;
  const totalMentors = mentors?.length || 0;
  const availableMentors = mentors?.filter(m => (m.current_mentees || 0) < (m.mentorship_capacity || 5)).length || 0;
  const completedAssignments = mentorAssignments?.filter(a => a.status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Mentorships</p>
                <p className="text-3xl font-bold text-primary">{activeAssignments}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mentors</p>
                <p className="text-3xl font-bold text-blue-600">{totalMentors}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-3xl font-bold text-green-600">{availableMentors}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-orange-600">{completedAssignments}</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Mentorship Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mentorship Assignments
              </CardTitle>
              <CardDescription>Connect startups with mentors and track progress</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Mentorship Assignment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="mentor_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentors?.filter(m => (m.current_mentees || 0) < (m.mentorship_capacity || 5)).map(mentor => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name} ({(mentor.mentorship_capacity || 5) - (mentor.current_mentees || 0)} slots available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select name="project_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select name="meeting_frequency" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Meeting Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="as_needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    name="goals"
                    placeholder="Mentorship Goals (comma-separated)"
                    required
                  />
                  
                  <Button type="submit" className="w-full">
                    Create Assignment
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading mentorship assignments...
            </div>
          ) : mentorAssignments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No mentorship assignments found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentorAssignments?.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.mentors?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.mentors?.company_affiliation}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assignment.incubation_projects?.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-40">
                          {assignment.incubation_projects?.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {assignment.meeting_frequency.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(assignment.assignment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assignment.status === 'active' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateAssignmentMutation.mutate({
                              id: assignment.id,
                              status: 'completed'
                            })}
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAssignmentMutation.mutate({
                              id: assignment.id,
                              status: 'paused'
                            })}
                          >
                            Pause
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
