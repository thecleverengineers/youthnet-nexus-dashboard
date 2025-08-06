
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { supabaseHelpers, EducationCourse } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';
import { CourseForm } from './CourseForm';

export const CourseManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<EducationCourse | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['education-courses'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.education_courses
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EducationCourse[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabaseHelpers.education_courses
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education-courses'] });
      toast({
        title: "Course deleted",
        description: "Course has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (course: EducationCourse) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteMutation.mutate(courseId);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Management</h2>
          <p className="text-gray-600">Create and manage educational courses</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      {showForm && (
        <CourseForm
          course={editingCourse}
          onClose={() => {
            setShowForm(false);
            setEditingCourse(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingCourse(null);
            queryClient.invalidateQueries({ queryKey: ['education-courses'] });
          }}
        />
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.course_name}</CardTitle>
                  <CardDescription className="mt-1">
                    {course.course_code} • {course.duration_months} months
                  </CardDescription>
                </div>
                <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>
              
              <div className="space-y-2 text-sm">
                {course.department && (
                  <div>
                    <span className="font-medium">Department:</span> {course.department}
                  </div>
                )}
                {course.credits && (
                  <div>
                    <span className="font-medium">Credits:</span> {course.credits}
                  </div>
                )}
                {course.max_students && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Max Students: {course.max_students}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(course)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(course.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">No courses found</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
