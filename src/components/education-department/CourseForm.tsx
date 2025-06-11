
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseFormProps {
  course?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const CourseForm = ({ course, onClose, onSuccess }: CourseFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: course || {
      course_name: '',
      course_code: '',
      description: '',
      duration_months: 6,
      credits: 3,
      department: '',
      max_students: 30,
      status: 'active'
    }
  });
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (course) {
        const { error } = await supabase
          .from('education_courses')
          .update(data)
          .eq('id', course.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education_courses')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: course ? "Course updated" : "Course created",
        description: `Course has been successfully ${course ? 'updated' : 'created'}.`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course ? 'Edit Course' : 'Create New Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course_name">Course Name</Label>
              <Input
                id="course_name"
                {...register('course_name', { required: 'Course name is required' })}
              />
              {errors.course_name && (
                <span className="text-red-500 text-sm">{errors.course_name.message}</span>
              )}
            </div>

            <div>
              <Label htmlFor="course_code">Course Code</Label>
              <Input
                id="course_code"
                {...register('course_code', { required: 'Course code is required' })}
              />
              {errors.course_code && (
                <span className="text-red-500 text-sm">{errors.course_code.message}</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration_months">Duration (months)</Label>
              <Input
                id="duration_months"
                type="number"
                {...register('duration_months', { required: 'Duration is required' })}
              />
            </div>

            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                {...register('credits')}
              />
            </div>

            <div>
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                {...register('max_students')}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register('department')}
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select onValueChange={(value) => setValue('status', value)} defaultValue={watch('status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
