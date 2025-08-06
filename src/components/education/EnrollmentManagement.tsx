
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/utils/supabaseHelpers';
import { Users, TrendingUp, Calendar, Award, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function EnrollmentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentEnrollments, isLoading } = useQuery({
    queryKey: ['recent-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.student_enrollments
        .select(`
          *,
          students:student_id (
            student_id,
            profiles:user_id (
              full_name
            )
          ),
          training_programs:program_id (
            name,
            duration_weeks
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: availableStudents } = useQuery({
    queryKey: ['available-students'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.students
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    },
    enabled: isDialogOpen
  });

  const { data: availablePrograms } = useQuery({
    queryKey: ['available-programs'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.training_programs
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      return data || [];
    },
    enabled: isDialogOpen
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: async (enrollmentData: any) => {
      const { data, error } = await supabaseHelpers.student_enrollments
        .insert([enrollmentData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-enrollments'] });
      setIsDialogOpen(false);
      toast({ title: "Enrollment created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating enrollment", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const enrollmentData = {
      student_id: formData.get('student_id') as string,
      program_id: formData.get('program_id') as string,
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    createEnrollmentMutation.mutate(enrollmentData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Enrollments
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enroll Student in Program</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select name="student_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudents?.map((student: any) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.profiles?.full_name || student.student_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select name="program_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Program" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrograms?.map((program: any) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button type="submit" className="w-full">
                  Create Enrollment
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading enrollments...
            </div>
          ) : recentEnrollments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No enrollments found
            </div>
          ) : (
            recentEnrollments?.map((enrollment: any) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">
                    {enrollment.students?.profiles?.full_name || 'Unknown Student'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {enrollment.training_programs?.name || 'Unknown Program'}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(enrollment.status)}>
                    {enrollment.status}
                  </Badge>
                  {enrollment.status === 'completed' && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Completed: {new Date(enrollment.updated_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
