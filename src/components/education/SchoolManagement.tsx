import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { School, Building, Users, Phone, Mail, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SchoolData {
  id?: string;
  name: string;
  udise_code: string;
  address: string;
  category: 'GPS' | 'GMS' | 'GHS' | 'GHSS';
  district: string;
  enrollment_count: number;
  phone: string;
  email: string;
  principal_name: string;
  established_year: number;
}

export function SchoolManagement() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<SchoolData>({
    defaultValues: {
      name: '',
      udise_code: '',
      address: '',
      category: 'GPS',
      district: '',
      enrollment_count: 0,
      phone: '',
      email: '',
      principal_name: '',
      established_year: new Date().getFullYear()
    }
  });

  const { data: schools, isLoading } = useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: SchoolData) => {
      const { error } = await supabase
        .from('schools')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School created successfully');
      setShowDialog(false);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create school: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SchoolData) => {
      const { error } = await supabase
        .from('schools')
        .update(data)
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School updated successfully');
      setShowDialog(false);
      setEditingSchool(null);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to update school: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
      toast.success('School deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete school: ' + error.message);
    }
  });

  const onSubmit = (data: SchoolData) => {
    if (editingSchool) {
      updateMutation.mutate({ ...data, id: editingSchool.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (school: any) => {
    setEditingSchool(school);
    form.reset(school);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this school?')) {
      deleteMutation.mutate(id);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'GPS': 'bg-blue-100 text-blue-800',
      'GMS': 'bg-green-100 text-green-800', 
      'GHS': 'bg-yellow-100 text-yellow-800',
      'GHSS': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading schools...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            <CardTitle>School Management</CardTitle>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingSchool(null); form.reset(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add School
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSchool ? 'Edit School' : 'Add New School'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter school name" required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="udise_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UDISE Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter UDISE code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter school address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
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
                              <SelectItem value="GPS">GPS (Government Primary School)</SelectItem>
                              <SelectItem value="GMS">GMS (Government Middle School)</SelectItem>
                              <SelectItem value="GHS">GHS (Government High School)</SelectItem>
                              <SelectItem value="GHSS">GHSS (Government Higher Secondary School)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter district" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="enrollment_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enrollment Count</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="0"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter phone number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Enter email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="principal_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter principal name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="established_year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Established Year</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              placeholder="Enter year"
                              onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                            />
                          </FormControl>
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
                      {editingSchool ? 'Update' : 'Create'} School
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
                <TableHead>School Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools?.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{school.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {school.udise_code}
                      </div>
                      <div className="text-sm text-muted-foreground">{school.address}</div>
                      {school.principal_name && (
                        <div className="text-sm text-muted-foreground">
                          Principal: {school.principal_name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(school.category)}>
                      {school.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{school.district}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {school.enrollment_count}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {school.phone && (
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {school.phone}
                        </div>
                      )}
                      {school.email && (
                        <div className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {school.email}
                        </div>
                      )}
                      {school.established_year && (
                        <div className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {school.established_year}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(school)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(school.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {schools?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No schools found. Add your first school to get started.
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