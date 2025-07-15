
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, Shield, Settings, Activity } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  phone: string | null;
}

interface Employee {
  id: string;
  user_id: string;
  employee_id: string;
  position: string | null;
  department: string | null;
  employment_status: string | null;
  profiles: UserProfile;
}

interface Student {
  id: string;
  user_id: string;
  student_id: string;
  status: string | null;
  profiles: UserProfile;
}

interface Trainer {
  id: string;
  user_id: string;
  trainer_id: string;
  specialization: string | null;
  status: string | null;
  profiles: UserProfile;
}

const ROLES = ['admin', 'staff', 'trainer', 'student'];

export const UserPermissions = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      setUsers(profilesData || []);

      // Fetch employees with their profiles
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .order('created_at', { ascending: false });

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

      // Fetch students with their profiles
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch trainers with their profiles
      const { data: trainersData, error: trainersError } = await supabase
        .from('trainers')
        .select(`
          *,
          profiles:user_id (*)
        `)
        .order('created_at', { ascending: false });

      if (trainersError) throw trainersError;
      setTrainers(trainersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'trainer': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to access user management features.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Permissions</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Permissions Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions across the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Users
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="trainers" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Trainers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Badge variant="outline">
                  {filteredUsers.length} users
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'Unknown'}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="employees">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.employee_id}
                    </TableCell>
                    <TableCell>
                      {employee.profiles?.full_name || 'Unknown'}
                    </TableCell>
                    <TableCell>{employee.position || 'N/A'}</TableCell>
                    <TableCell>{employee.department || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={employee.employment_status === 'active' ? 'default' : 'secondary'}>
                        {employee.employment_status || 'unknown'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="students">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.student_id}
                    </TableCell>
                    <TableCell>
                      {student.profiles?.full_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {student.profiles?.email || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status || 'pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="trainers">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer) => (
                  <TableRow key={trainer.id}>
                    <TableCell className="font-medium">
                      {trainer.trainer_id}
                    </TableCell>
                    <TableCell>
                      {trainer.profiles?.full_name || 'Unknown'}
                    </TableCell>
                    <TableCell>{trainer.specialization || 'General'}</TableCell>
                    <TableCell>
                      <Badge variant={trainer.status === 'active' ? 'default' : 'secondary'}>
                        {trainer.status || 'active'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
