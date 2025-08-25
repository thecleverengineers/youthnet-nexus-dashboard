import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Calendar, MapPin, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<any>(null);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    gender: 'male',
    education_level: 'secondary',
    date_of_birth: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  // Fetch students with profiles
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students-management'],
    queryFn: async () => {
      const { data: studentsData, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const studentsWithProfiles = await Promise.all(
        (studentsData || []).map(async (student) => {
          if (student.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, phone, address')
              .eq('user_id', student.user_id)
              .single();
            
            return { ...student, profiles: profile || undefined };
          }
          return { ...student, profiles: undefined };
        })
      );

      return studentsWithProfiles;
    }
  });

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Generate a unique user_id
      const userId = crypto.randomUUID();
      
      // First create a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          role: 'student'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create the student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          student_id: data.student_id,
          user_id: userId,
          status: data.status,
          gender: data.gender,
          education_level: data.education_level,
          date_of_birth: data.date_of_birth,
          emergency_contact: data.emergency_contact,
          emergency_phone: data.emergency_phone
        })
        .select()
        .single();

      if (studentError) throw studentError;
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students-management'] });
      toast({ title: 'Student created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating student', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      // Update student
      const { error: studentError } = await supabase
        .from('students')
        .update({
          student_id: data.student_id,
          status: data.status,
          gender: data.gender,
          education_level: data.education_level,
          date_of_birth: data.date_of_birth,
          emergency_contact: data.emergency_contact,
          emergency_phone: data.emergency_phone
        })
        .eq('id', id);

      if (studentError) throw studentError;

      // Update profile if user_id exists
      const student = students.find(s => s.id === id);
      if (student?.user_id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            address: data.address
          })
          .eq('user_id', student.user_id);

        if (profileError) throw profileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students-management'] });
      toast({ title: 'Student updated successfully' });
      setEditingStudent(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating student', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students-management'] });
      toast({ title: 'Student deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error deleting student', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      student_id: '',
      full_name: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      gender: 'male',
      education_level: 'secondary',
      date_of_birth: '',
      emergency_contact: '',
      emergency_phone: ''
    });
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      full_name: student.profiles?.full_name || '',
      email: student.profiles?.email || '',
      phone: student.profiles?.phone || '',
      address: student.profiles?.address || '',
      status: student.status || 'active',
      gender: student.gender || 'male',
      education_level: student.education_level || 'secondary',
      date_of_birth: student.date_of_birth || '',
      emergency_contact: student.emergency_contact || '',
      emergency_phone: student.emergency_phone || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudentMutation.mutate({ id: editingStudent.id, data: formData });
    } else {
      createStudentMutation.mutate(formData);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'graduated': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">{students.length}</div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-emerald-400">
              {students.filter(s => s.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-400">
              {students.filter(s => s.status === 'graduated').length}
            </div>
            <p className="text-sm text-muted-foreground">Graduated</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-400">
              {students.filter(s => !s.profiles).length}
            </div>
            <p className="text-sm text-muted-foreground">Without Profile</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="student_id">Student ID</Label>
                      <Input
                        id="student_id"
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="graduated">Graduated</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="education_level">Education Level</Label>
                    <Select 
                      value={formData.education_level} 
                      onValueChange={(value) => setFormData({ ...formData, education_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="higher_secondary">Higher Secondary</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
                      <Input
                        id="emergency_contact"
                        value={formData.emergency_contact}
                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_phone">Emergency Phone</Label>
                      <Input
                        id="emergency_phone"
                        value={formData.emergency_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingStudent(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingStudent ? 'Update' : 'Create'} Student
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Students Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No students found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="futuristic-card hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {student.profiles?.full_name?.split(' ').map(n => n[0]).join('') || student.student_id.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {student.profiles?.full_name || `Student ${student.student_id}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">{student.student_id}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleEdit(student);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this student?')) {
                              deleteStudentMutation.mutate(student.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status || 'Unknown'}
                        </Badge>
                        {!student.profiles && (
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                            No Profile
                          </Badge>
                        )}
                      </div>
                      {student.profiles?.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{student.profiles.email}</span>
                        </div>
                      )}
                      {student.profiles?.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{student.profiles.phone}</span>
                        </div>
                      )}
                      {student.date_of_birth && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>DOB: {new Date(student.date_of_birth).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Student Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                    {viewStudent.profiles?.full_name?.split(' ').map(n => n[0]).join('') || viewStudent.student_id.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewStudent.profiles?.full_name || `Student ${viewStudent.student_id}`}
                  </h3>
                  <p className="text-muted-foreground">{viewStudent.student_id}</p>
                  <Badge className={getStatusColor(viewStudent.status)}>
                    {viewStudent.status || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-muted-foreground">
                    {viewStudent.profiles?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-muted-foreground">
                    {viewStudent.profiles?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label>Gender</Label>
                  <p className="text-muted-foreground">
                    {viewStudent.gender || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <p className="text-muted-foreground">
                    {viewStudent.date_of_birth ? new Date(viewStudent.date_of_birth).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label>Education Level</Label>
                  <p className="text-muted-foreground">
                    {viewStudent.education_level || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Created At</Label>
                  <p className="text-muted-foreground">
                    {new Date(viewStudent.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {viewStudent.profiles?.address && (
                <div>
                  <Label>Address</Label>
                  <p className="text-muted-foreground">{viewStudent.profiles.address}</p>
                </div>
              )}

              {(viewStudent.emergency_contact || viewStudent.emergency_phone) && (
                <div>
                  <Label>Emergency Contact</Label>
                  <p className="text-muted-foreground">
                    {viewStudent.emergency_contact} {viewStudent.emergency_phone && `- ${viewStudent.emergency_phone}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};