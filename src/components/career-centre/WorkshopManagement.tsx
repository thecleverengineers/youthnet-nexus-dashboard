import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface WorkshopData {
  id?: string;
  title: string;
  description: string;
  facilitator_id?: string;
  workshop_date: string;
  duration_hours: number;
  venue: string;
  max_participants: number;
  category: string;
  materials_provided: string[];
  learning_objectives: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export function WorkshopManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<WorkshopData | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<WorkshopData>({
    defaultValues: {
      title: '',
      description: '',
      facilitator_id: '',
      workshop_date: '',
      duration_hours: 2.0,
      venue: '',
      max_participants: 30,
      category: 'career_development',
      materials_provided: [],
      learning_objectives: [],
      status: 'scheduled'
    }
  });

  const { data: workshops, isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          profiles!workshops_facilitator_id_fkey (
            full_name
          )
        `)
        .order('workshop_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: facilitators } = useQuery({
    queryKey: ['facilitators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('role', ['admin', 'staff', 'trainer'])
        .order('full_name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkshopData) => {
      const { error } = await supabase
        .from('workshops')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      toast.success('Workshop created successfully');
      setShowDialog(false);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create workshop: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: WorkshopData) => {
      const { error } = await supabase
        .from('workshops')
        .update(data)
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      toast.success('Workshop updated successfully');
      setShowDialog(false);
      setEditingWorkshop(null);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to update workshop: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
      toast.success('Workshop deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete workshop: ' + error.message);
    }
  });

  const onSubmit = (data: WorkshopData) => {
    if (editingWorkshop) {
      updateMutation.mutate({ ...data, id: editingWorkshop.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (workshop: any) => {
    setEditingWorkshop(workshop);
    form.reset({
      ...workshop,
      workshop_date: new Date(workshop.workshop_date).toISOString().slice(0, 16)
    });
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this workshop?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'ongoing': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading workshops...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Workshop Management</CardTitle>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingWorkshop(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Workshop
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter workshop title" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter workshop description" rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="facilitator_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facilitator</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select facilitator" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {facilitators?.map((facilitator) => (
                                <SelectItem key={facilitator.id} value={facilitator.id}>
                                  {facilitator.full_name} ({facilitator.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="career_development">Career Development</SelectItem>
                              <SelectItem value="skill_building">Skill Building</SelectItem>
                              <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                              <SelectItem value="personal_development">Personal Development</SelectItem>
                              <SelectItem value="technology">Technology</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="workshop_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date & Time</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="datetime-local" 
                              required 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (Hours)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              step="0.5"
                              placeholder="2.0"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 2.0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max_participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="30"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter venue location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingWorkshop ? 'Update' : 'Create'} Workshop
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workshop Details</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Facilitator</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops?.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{workshop.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {workshop.description}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {workshop.category?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(workshop.workshop_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(workshop.workshop_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {workshop.duration_hours}h duration
                      </div>
                      {workshop.venue && (
                        <div className="text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {workshop.venue}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {workshop.profiles?.full_name || 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Max {workshop.max_participants}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(workshop.status)}>
                      {workshop.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(workshop)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(workshop.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {workshops?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No workshops found. Add your first workshop to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}