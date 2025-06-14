
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, Award } from 'lucide-react';

export function EnrollmentManagement() {
  const { data: recentEnrollments, isLoading } = useQuery({
    queryKey: ['recent-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          students!student_enrollments_student_id_fkey (
            student_id,
            profiles!students_user_id_fkey (
              full_name
            )
          ),
          training_programs!student_enrollments_program_id_fkey (
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
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Enrollments
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
            recentEnrollments?.map((enrollment) => (
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
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
