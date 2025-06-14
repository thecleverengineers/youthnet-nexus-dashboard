
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const StudentAssignment = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignmentReason, setAssignmentReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: courses } = useQuery({
    queryKey: ['education-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_courses')
        .select('*')
        .eq('status', 'active')
        .order('course_name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: students } = useQuery({
    queryKey: ['students-with-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['course-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          students!inner(
            student_id,
            profiles!inner(full_name, email)
          ),
          education_courses!inner(course_name, course_code)
        `)
        .order('enrollment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('course_enrollments')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
      setSelectedCourse('');
      setSelectedStudent('');
      setAssignmentReason('');
      toast.success('Student assigned successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign student. Please try again.');
    },
  });

  const handleAssignment = () => {
    if (!selectedCourse || !selectedStudent) {
      toast.error('Please select both a course and a student.');
      return;
    }

    assignMutation.mutate({
      student_id: selectedStudent,
      course_id: selectedCourse,
      assignment_reason: assignmentReason,
      status: 'enrolled'
    });
  };

  const filteredEnrollments = enrollments?.filter(enrollment =>
    enrollment.students?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.education_courses?.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Student Assignment</h2>
        <p className="text-gray-600">Assign students to courses and track enrollments</p>
      </div>

      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Assign Student to Course
          </CardTitle>
          <CardDescription>
            Select a student and course to create a new enrollment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.course_name} ({course.course_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.profiles?.full_name} ({student.student_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label>Assignment Reason (Optional)</Label>
            <Textarea
              value={assignmentReason}
              onChange={(e) => setAssignmentReason(e.target.value)}
              placeholder="Reason for this assignment..."
              rows={2}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleAssignment}
              disabled={assignMutation.isPending || !selectedCourse || !selectedStudent}
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Student'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Enrollments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Current Enrollments</CardTitle>
              <CardDescription>View and manage student course assignments</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading enrollments...</div>
          ) : (
            <div className="space-y-4">
              {filteredEnrollments?.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {enrollment.students?.profiles?.full_name || 'Unknown Student'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {enrollment.students?.student_id} • {enrollment.students?.profiles?.email}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Course: {enrollment.education_courses?.course_name} ({enrollment.education_courses?.course_code})
                    </div>
                    {enrollment.assignment_reason && (
                      <div className="text-sm text-gray-500 mt-1">
                        Reason: {enrollment.assignment_reason}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      enrollment.status === 'enrolled' ? 'default' :
                      enrollment.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {enrollment.status}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">
                      Enrolled: {new Date(enrollment.enrollment_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}

              {filteredEnrollments?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No enrollments found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
