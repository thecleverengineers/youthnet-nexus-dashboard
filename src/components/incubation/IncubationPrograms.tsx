
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
import { Lightbulb, Plus, Calendar, Users, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const IncubationPrograms = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: programs, isLoading } = useQuery({
    queryKey: ['incubation-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incubation_program_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const createProgramMutation = useMutation({
    mutationFn: async (programData: any) => {
      const { data, error } = await supabase
        .from('incubation_program_details')
        .insert([programData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incubation-programs'] });
      setIsDialogOpen(false);
      setEditingProgram(null);
      toast.success('Program created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating program: ${error.message}`);
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('incubation_program_details')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incubation-programs'] });
      setIsDialogOpen(false);
      setEditingProgram(null);
      toast.success('Program updated successfully');
    }
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('incubation_program_details')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incubation-programs'] });
      toast.success('Program deleted successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const programData = {
      program_name: formData.get('program_name') as string,
      description: formData.get('description') as string,
      duration_months: parseInt(formData.get('duration_months') as string),
      max_participants: parseInt(formData.get('max_participants') as string),
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      status: formData.get('status') as string,
      modules: (formData.get('modules') as string).split(',').map(m => m.trim()).filter(m => m),
      requirements: (formData.get('requirements') as string).split(',').map(r => r.trim()).filter(r => r)
    };

    if (editingProgram) {
      updateProgramMutation.mutate({ id: editingProgram.id, ...programData });
    } else {
      createProgramMutation.mutate(programData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const activePrograms = programs?.filter(p => p.status === 'active').length || 0;
  const totalParticipants = programs?.reduce((sum, p) => sum + (p.max_participants || 0), 0) || 0;
  const avgDuration = programs?.length > 0 ? 
    programs.reduce((sum, p) => sum + p.duration_months, 0) / programs.length : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Programs</p>
                <p className="text-3xl font-bold text-primary">{activePrograms}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Programs</p>
                <p className="text-3xl font-bold text-blue-600">{programs?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Participants</p>
                <p className="text-3xl font-bold text-green-600">{totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-3xl font-bold text-orange-600">{avgDuration.toFixed(1)}m</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Programs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Incubation Programs
              </CardTitle>
              <CardDescription>Manage incubation program schedules and content</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProgram ? 'Edit Program' : 'Create New Program'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    name="program_name"
                    placeholder="Program Name"
                    defaultValue={editingProgram?.program_name || ''}
                    required
                  />
                  
                  <Textarea
                    name="description"
                    placeholder="Program Description"
                    defaultValue={editingProgram?.description || ''}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="duration_months"
                      type="number"
                      placeholder="Duration (months)"
                      defaultValue={editingProgram?.duration_months || ''}
                      required
                    />
                    <Input
                      name="max_participants"
                      type="number"
                      placeholder="Max Participants"
                      defaultValue={editingProgram?.max_participants || ''}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="start_date"
                      type="date"
                      placeholder="Start Date"
                      defaultValue={editingProgram?.start_date || ''}
                    />
                    <Input
                      name="end_date"
                      type="date"
                      placeholder="End Date"
                      defaultValue={editingProgram?.end_date || ''}
                    />
                  </div>
                  
                  <Select name="status" defaultValue={editingProgram?.status || 'planning'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    name="modules"
                    placeholder="Program Modules (comma-separated)"
                    defaultValue={editingProgram?.modules?.join(', ') || ''}
                  />
                  
                  <Textarea
                    name="requirements"
                    placeholder="Requirements (comma-separated)"
                    defaultValue={editingProgram?.requirements?.join(', ') || ''}
                  />
                  
                  <Button type="submit" className="w-full">
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading programs...
            </div>
          ) : programs?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No programs found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs?.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{program.program_name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-40">
                          {program.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{program.duration_months} months</TableCell>
                    <TableCell>{program.max_participants || 'Unlimited'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {program.start_date && (
                          <>
                            <div>Start: {new Date(program.start_date).toLocaleDateString()}</div>
                            {program.end_date && (
                              <div>End: {new Date(program.end_date).toLocaleDateString()}</div>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(program.status)}>
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProgram(program);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProgramMutation.mutate(program.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
