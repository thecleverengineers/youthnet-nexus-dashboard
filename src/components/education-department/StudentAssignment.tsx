import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const StudentAssignment = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignmentReason, setAssignmentReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch courses
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

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch course enrollments
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['course-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          education_courses (
            course_name,
            course_code,
            department
          )
        `)
        .order('enrollment_date', { ascending: false });
      
      if (error) throw error;
      
      // Fetch student details separately for each enrollment
      const enrichedData = await Promise.all(
        (data || []).map(async (enrollment) => {
          const { data: studentData } = await supabase
            .from('profiles')
            .select('full_name, email, student_id')
            .eq('user_id', enrollment.student_id)
            .single();
          
          return {
            ...enrollment,
            student: studentData,
            course: enrollment.education_courses
          };
        })
      );
      
      return enrichedData;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('course_enrollments')
        .insert([{
          ...data,
          enrolled_by: user?.id
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-enrollments'] });
      setSelectedCourse('');
      setSelectedStudent('');
      setAssignmentReason('');
      toast({
        title: "Student assigned",
        description: "Student has been successfully assigned to the course.",
      });
    },
    onError: (error: any) => {
      console.error('Assignment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign student. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAssignment = () => {
    if (!selectedCourse || !selectedStudent) {
      toast({
        title: "Missing information",
        description: "Please select both a course and a student.",
        variant: "destructive",
      });
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
    enrollment.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course?.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <SelectItem key={student.user_id} value={student.user_id}>
                      {student.full_name} {student.student_id && `(${student.student_id})`}
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
                      {enrollment.student?.full_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {enrollment.student?.student_id} • {enrollment.student?.email}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Course: {enrollment.course?.course_name} ({enrollment.course?.course_code})
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