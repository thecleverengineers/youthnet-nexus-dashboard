
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CourseFormProps {
  course?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const CourseForm = ({ course, onClose, onSuccess }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    duration_weeks: course?.duration_weeks || 1,
    level: course?.level || 'beginner',
    max_students: course?.max_students || 20,
    price: course?.price || 0,
    instructor_id: course?.instructor_id || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (course) {
        // Update existing course
        const { error } = await supabase
          .from('training_programs')
          .update(formData)
          .eq('id', course.id);

        if (error) throw error;
        toast.success('Course updated successfully!');
      } else {
        // Create new course
        const { error } = await supabase
          .from('training_programs')
          .insert([formData]);

        if (error) throw error;
        toast.success('Course created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{course ? 'Edit Course' : 'Create New Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_weeks}
                onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxStudents">Max Students</Label>
              <Input
                id="maxStudents"
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
