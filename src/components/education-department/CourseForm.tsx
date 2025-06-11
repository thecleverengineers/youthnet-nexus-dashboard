
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const courseSchema = z.object({
  course_name: z.string().min(1, 'Course name is required'),
  course_code: z.string().min(1, 'Course code is required'),
  description: z.string().optional(),
  duration_months: z.number().min(1, 'Duration must be at least 1 month'),
  credits: z.number().min(1, 'Credits must be at least 1'),
  department: z.string().min(1, 'Department is required'),
  max_students: z.number().min(1, 'Maximum students must be at least 1'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CourseFormData>;
}

export const CourseForm = ({ onSubmit, onCancel, initialData }: CourseFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData,
  });

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {initialData ? 'Edit Course' : 'Create New Course'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course_name">Course Name</Label>
              <Input
                id="course_name"
                {...register('course_name')}
                className="mt-1"
              />
              {errors.course_name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.course_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="course_code">Course Code</Label>
              <Input
                id="course_code"
                {...register('course_code')}
                className="mt-1"
              />
              {errors.course_code && (
                <p className="text-sm text-destructive mt-1">
                  {errors.course_code.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="duration_months">Duration (Months)</Label>
              <Input
                id="duration_months"
                type="number"
                {...register('duration_months', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.duration_months && (
                <p className="text-sm text-destructive mt-1">
                  {errors.duration_months.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                {...register('credits', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.credits && (
                <p className="text-sm text-destructive mt-1">
                  {errors.credits.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register('department')}
                className="mt-1"
              />
              {errors.department && (
                <p className="text-sm text-destructive mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="max_students">Maximum Students</Label>
              <Input
                id="max_students"
                type="number"
                {...register('max_students', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.max_students && (
                <p className="text-sm text-destructive mt-1">
                  {errors.max_students.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
