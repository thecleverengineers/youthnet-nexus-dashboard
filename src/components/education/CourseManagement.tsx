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
import { Plus, Search, Edit, BookOpen, Users, Clock, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CourseManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['education-courses'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.education_courses
        .select(`
          *,
          course_enrollments(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      const { data, error } = await supabaseHelpers.education_courses
        .insert([courseData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-courses'] });
      setIsDialogOpen(false);
      setEditingCourse(null);
      toast({ title: "Course created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating course", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, ...courseData }: any) => {
      const { data, error } = await supabaseHelpers.education_courses
        .update(courseData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-courses'] });
      setIsDialogOpen(false);
      setEditingCourse(null);
      toast({ title: "Course updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating course", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch = course.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const courseData = {
      course_name: formData.get('course_name') as string,
      course_code: formData.get('course_code') as string,
      description: formData.get('description') as string,
      duration_months: parseInt(formData.get('duration_months') as string) || null,
      credits: parseInt(formData.get('credits') as string) || null,
      department: formData.get('department') as string,
      max_students: parseInt(formData.get('max_students') as string) || null,
      status: formData.get('status') as 'active' | 'inactive' | 'archived'
    };

    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, ...courseData });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Management
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="course_name"
                  placeholder="Course Name"
                  defaultValue={editingCourse?.course_name || ''}
                  required
                />
                <Input
                  name="course_code"
                  placeholder="Course Code (e.g., CS101)"
                  defaultValue={editingCourse?.course_code || ''}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Course Description"
                  defaultValue={editingCourse?.description || ''}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="duration_months"
                    type="number"
                    placeholder="Duration (months)"
                    defaultValue={editingCourse?.duration_months || ''}
                  />
                  <Input
                    name="credits"
                    type="number"
                    placeholder="Credits"
                    defaultValue={editingCourse?.credits || ''}
                  />
                </div>
                <Input
                  name="department"
                  placeholder="Department"
                  defaultValue={editingCourse?.department || ''}
                />
                <Input
                  name="max_students"
                  type="number"
                  placeholder="Max Students"
                  defaultValue={editingCourse?.max_students || ''}
                />
                <Select name="status" defaultValue={editingCourse?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full">
                  {editingCourse ? 'Update' : 'Create'} Course
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
              placeholder="Search courses..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading courses...
            </div>
          ) : filteredCourses?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No courses found
            </div>
          ) : (
            filteredCourses?.map((course: any) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{course.course_name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {course.course_code}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {course.description || 'No description available'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCourse(course);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration_months || 'TBD'} months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>{course.credits || 'No'} credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Max: {course.max_students || 'Unlimited'}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {course.department || 'General'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}