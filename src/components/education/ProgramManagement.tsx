
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/utils/supabaseHelpers';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ProgramManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: programs, isLoading } = useQuery({
    queryKey: ['training-programs'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.training_programs
        .select(`
          *,
          trainers:trainer_id (
            trainer_id,
            profiles:user_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const createProgramMutation = useMutation({
    mutationFn: async (programData: any) => {
      const { data, error } = await supabaseHelpers.training_programs
        .insert([programData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      setIsDialogOpen(false);
      setEditingProgram(null);
      toast({ title: "Program created successfully" });
    }
  });

  const updateProgramMutation = useMutation({
    mutationFn: async ({ id, ...programData }: any) => {
      const { data, error } = await supabaseHelpers.training_programs
        .update(programData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-programs'] });
      setIsDialogOpen(false);
      setEditingProgram(null);
      toast({ title: "Program updated successfully" });
    }
  });

  const filteredPrograms = programs?.filter((program: any) => {
    const matchesSearch = program.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const programData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      duration_weeks: parseInt(formData.get('duration_weeks') as string),
      max_participants: parseInt(formData.get('max_participants') as string),
      status: formData.get('status') as 'pending' | 'active' | 'completed' | 'dropped'
    };

    if (editingProgram) {
      updateProgramMutation.mutate({ id: editingProgram.id, ...programData });
    } else {
      createProgramMutation.mutate(programData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Training Programs
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'Edit Program' : 'Create New Program'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Program Name"
                  defaultValue={editingProgram?.name || ''}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  defaultValue={editingProgram?.description || ''}
                />
                <Input
                  name="duration_weeks"
                  type="number"
                  placeholder="Duration (weeks)"
                  defaultValue={editingProgram?.duration_weeks || ''}
                  required
                />
                <Input
                  name="max_participants"
                  type="number"
                  placeholder="Max Participants"
                  defaultValue={editingProgram?.max_participants || ''}
                />
                <Select name="status" defaultValue={editingProgram?.status || 'pending'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full">
                  {editingProgram ? 'Update' : 'Create'} Program
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading programs...
            </div>
          ) : filteredPrograms?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No programs found
            </div>
          ) : (
            filteredPrograms?.map((program: any) => (
              <div key={program.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{program.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
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
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                <div className="text-xs text-muted-foreground">
                  Duration: {program.duration_weeks} weeks | 
                  Max Participants: {program.max_participants || 'Unlimited'}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
