import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Target, Clock, CheckCircle, AlertCircle, Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface SkillAssessmentProps {
  detailed?: boolean;
}

export function SkillAssessment({ detailed = false }: SkillAssessmentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['skill-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select(`
          *,
          students:student_id (
            student_id,
            profiles:user_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(detailed ? 50 : 10);

      if (error) throw error;
      return data || [];
    }
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      const { data, error } = await supabase
        .from('skill_assessments')
        .insert([assessmentData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-assessments'] });
      setIsDialogOpen(false);
      setEditingAssessment(null);
      toast.success('Assessment added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding assessment: ${error.message}`);
    }
  });

  const updateAssessmentMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('skill_assessments')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-assessments'] });
      setIsDialogOpen(false);
      setEditingAssessment(null);
      toast.success('Assessment updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assessmentData = {
      skill_name: formData.get('skill_name') as string,
      level: formData.get('level') as string,
      progress: parseInt(formData.get('progress') as string),
      status: formData.get('status') as string,
      last_assessed: formData.get('last_assessed') as string,
      next_assessment: formData.get('next_assessment') as string,
      student_id: formData.get('student_id') as string
    };

    if (editingAssessment) {
      updateAssessmentMutation.mutate({ id: editingAssessment.id, ...assessmentData });
    } else {
      createAssessmentMutation.mutate(assessmentData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'pending': return AlertCircle;
      default: return Target;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skill Assessments
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingAssessment ? 'Edit Assessment' : 'Add New Assessment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="skill_name"
                  placeholder="Skill Name"
                  defaultValue={editingAssessment?.skill_name || ''}
                  required
                />
                <Select name="level" defaultValue={editingAssessment?.level || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Skill Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="progress"
                  type="number"
                  placeholder="Progress (0-100)"
                  min="0"
                  max="100"
                  defaultValue={editingAssessment?.progress || ''}
                  required
                />
                <Select name="status" defaultValue={editingAssessment?.status || 'pending'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="last_assessed"
                  type="date"
                  placeholder="Last Assessed"
                  defaultValue={editingAssessment?.last_assessed || ''}
                />
                <Input
                  name="next_assessment"
                  type="date"
                  placeholder="Next Assessment"
                  defaultValue={editingAssessment?.next_assessment || ''}
                />
                <Button type="submit" className="w-full">
                  {editingAssessment ? 'Update' : 'Add'} Assessment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading assessments...
          </div>
        ) : assessments?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No skill assessments found. Add one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {!detailed && assessments && assessments.length > 3 && (
              <div className="text-center mb-4">
                <Button variant="outline" size="sm">
                  View All Assessments ({assessments.length})
                </Button>
              </div>
            )}
            
            {assessments?.slice(0, detailed ? assessments.length : 3).map((assessment) => {
              const StatusIcon = getStatusIcon(assessment.status);
              return (
                <div key={assessment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{assessment.skill_name}</h3>
                      <p className="text-sm text-muted-foreground">{assessment.level}</p>
                      {assessment.students?.profiles?.full_name && (
                        <p className="text-sm text-muted-foreground">
                          Student: {assessment.students.profiles.full_name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assessment.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {assessment.status.replace('_', ' ')}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingAssessment(assessment);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{assessment.progress}%</span>
                    </div>
                    <Progress value={assessment.progress} className="h-2" />
                  </div>
                  
                  {detailed && (
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Last: {assessment.last_assessed || 'Not assessed'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Next: {assessment.next_assessment || 'Not scheduled'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}