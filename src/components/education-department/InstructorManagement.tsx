
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';

export const InstructorManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: instructors, isLoading } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('instructor_id');

      if (error) throw error;
      return data || [];
    }
  });

  const createInstructorMutation = useMutation({
    mutationFn: async (instructorData: any) => {
      const { data, error } = await supabase
        .from('instructors')
        .insert([instructorData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      setIsDialogOpen(false);
      setEditingInstructor(null);
      toast.success('Instructor added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding instructor: ${error.message}`);
    }
  });

  const updateInstructorMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('instructors')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      setIsDialogOpen(false);
      setEditingInstructor(null);
      toast.success('Instructor updated successfully');
    }
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('instructors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor deleted successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const instructorData = {
      instructor_id: formData.get('instructor_id') as string,
      qualification: formData.get('qualification') as string,
      specialization: (formData.get('specialization') as string).split(',').map(s => s.trim()),
      subjects: (formData.get('subjects') as string).split(',').map(s => s.trim()),
      experience_years: parseInt(formData.get('experience_years') as string),
      status: formData.get('status') as string,
      salary: parseFloat(formData.get('salary') as string)
    };

    if (editingInstructor) {
      updateInstructorMutation.mutate({ id: editingInstructor.id, ...instructorData });
    } else {
      createInstructorMutation.mutate(instructorData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Instructor Management
            </CardTitle>
            <CardDescription>Manage course instructors and their assignments</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Instructor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="instructor_id"
                  placeholder="Instructor ID"
                  defaultValue={editingInstructor?.instructor_id || ''}
                  required
                />
                
                <Input
                  name="qualification"
                  placeholder="Qualification"
                  defaultValue={editingInstructor?.qualification || ''}
                  required
                />
                
                <Input
                  name="specialization"
                  placeholder="Specialization (comma-separated)"
                  defaultValue={editingInstructor?.specialization?.join(', ') || ''}
                />
                
                <Input
                  name="subjects"
                  placeholder="Subjects (comma-separated)"
                  defaultValue={editingInstructor?.subjects?.join(', ') || ''}
                />
                
                <Input
                  name="experience_years"
                  type="number"
                  placeholder="Years of Experience"
                  defaultValue={editingInstructor?.experience_years || ''}
                />
                
                <Input
                  name="salary"
                  type="number"
                  step="0.01"
                  placeholder="Salary"
                  defaultValue={editingInstructor?.salary || ''}
                />
                
                <Select name="status" defaultValue={editingInstructor?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button type="submit" className="w-full">
                  {editingInstructor ? 'Update Instructor' : 'Add Instructor'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading instructors...
          </div>
        ) : instructors?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No instructors found. Add one to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instructor ID</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors?.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell className="font-medium">{instructor.instructor_id}</TableCell>
                  <TableCell>{instructor.qualification}</TableCell>
                  <TableCell>
                    {instructor.specialization?.slice(0, 2).map((spec: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {spec}
                      </Badge>
                    ))}
                    {instructor.specialization?.length > 2 && (
                      <Badge variant="outline">+{instructor.specialization.length - 2}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{instructor.experience_years} years</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(instructor.status)}>
                      {instructor.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingInstructor(instructor);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInstructorMutation.mutate(instructor.id)}
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
  );
};
