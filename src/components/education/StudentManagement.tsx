
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Edit, Users, Mail, Phone, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { StudentRegistrationForm } from './StudentRegistrationForm';

export function StudentManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!students_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: studentDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['student-details'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('student_details' as any)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching student details:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Error in query:', error);
        return [];
      }
    }
  });

  const createStudentMutation = useMutation({
    mutationFn: async (studentData: any) => {
      // First create user via auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentData.email,
        password: 'temporary123',
        options: {
          data: {
            full_name: studentData.full_name,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;

      // Then update student record with additional fields
      if (authData.user) {
        const { error: studentError } = await supabase
          .from('students')
          .update({
            date_of_birth: studentData.date_of_birth,
            gender: studentData.gender,
            education_level: studentData.education_level,
            emergency_contact: studentData.emergency_contact,
            emergency_phone: studentData.emergency_phone,
            status: studentData.status
          })
          .eq('user_id', authData.user.id);
      
        if (studentError) throw studentError;
      }
      
      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsDialogOpen(false);
      setEditingStudent(null);
      toast.success('Student created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating student: ${error.message}`);
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, ...studentData }: any) => {
      const { data, error } = await supabase
        .from('students')
        .update({
          date_of_birth: studentData.date_of_birth,
          gender: studentData.gender,
          education_level: studentData.education_level,
          emergency_contact: studentData.emergency_contact,
          emergency_phone: studentData.emergency_phone,
          status: studentData.status
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsDialogOpen(false);
      setEditingStudent(null);
      toast.success('Student updated successfully');
    }
  });

  const filteredStudents = students?.filter(student => {
    const matchesSearch = student.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const studentData = {
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      gender: formData.get('gender') as string,
      education_level: formData.get('education_level') as string,
      emergency_contact: formData.get('emergency_contact') as string,
      emergency_phone: formData.get('emergency_phone') as string,
      status: formData.get('status') as string
    };

    if (editingStudent) {
      updateStudentMutation.mutate({ id: editingStudent.id, ...studentData });
    } else {
      createStudentMutation.mutate(studentData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Student Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Management
            </div>
            <div className="flex gap-2">
              <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Full Registration
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Complete Student Registration</DialogTitle>
                  </DialogHeader>
                  <StudentRegistrationForm />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingStudent ? 'Edit Student' : 'Add New Student'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="full_name"
                      placeholder="Full Name"
                      defaultValue={editingStudent?.profiles?.full_name || ''}
                      required
                    />
                    {!editingStudent && (
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                      />
                    )}
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      defaultValue={editingStudent?.profiles?.phone || ''}
                    />
                    <Input
                      name="date_of_birth"
                      type="date"
                      placeholder="Date of Birth"
                      defaultValue={editingStudent?.date_of_birth || ''}
                    />
                    <Select name="gender" defaultValue={editingStudent?.gender || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      name="education_level"
                      placeholder="Education Level"
                      defaultValue={editingStudent?.education_level || ''}
                    />
                    <Input
                      name="emergency_contact"
                      placeholder="Emergency Contact Name"
                      defaultValue={editingStudent?.emergency_contact || ''}
                    />
                    <Input
                      name="emergency_phone"
                      placeholder="Emergency Contact Phone"
                      defaultValue={editingStudent?.emergency_phone || ''}
                    />
                    <Select name="status" defaultValue={editingStudent?.status || 'pending'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="submit" className="w-full">
                      {editingStudent ? 'Update' : 'Add'} Student
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading students...
              </div>
            ) : filteredStudents?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students found
              </div>
            ) : (
              filteredStudents?.map((student) => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{student.profiles?.full_name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(student.status || 'pending')}>
                        {student.status || 'pending'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStudent(student);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {student.profiles?.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {student.profiles?.phone || 'N/A'}
                    </div>
                  </div>
                  {student.education_level && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Education: {student.education_level}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Student Registration Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Complete Student Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingDetails ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading detailed registrations...
              </div>
            ) : !studentDetails || studentDetails.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No complete registrations found
              </div>
            ) : (
              studentDetails?.map((detail: any) => (
                <div key={detail.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{detail.full_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Candidate ID: {detail.candidate_id}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Complete Registration
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {detail.email_id}
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span> {detail.country_code} {detail.mobile_no}
                    </div>
                    <div>
                      <span className="font-medium">Gender:</span> {detail.gender}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {detail.category}
                    </div>
                  </div>
                  {detail.currently_enrolled && (
                    <div className="mt-2 text-sm text-green-600">
                      Currently Enrolled - {detail.training_status}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
