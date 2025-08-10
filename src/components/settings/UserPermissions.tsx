
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Users, UserPlus, Edit, Trash2, Shield, Eye, Lock, Unlock, Search } from 'lucide-react';

export const UserPermissions = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Mock data for roles and permissions
  const [roles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access and control',
      color: 'destructive',
      userCount: 2,
      permissions: ['all']
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access to most features',
      color: 'default',
      userCount: 5,
      permissions: ['user_management', 'system_config', 'reports', 'backup']
    },
    {
      id: 3,
      name: 'HR Manager',
      description: 'Human resources and employee management',
      color: 'secondary',
      userCount: 8,
      permissions: ['employee_management', 'payroll', 'attendance', 'performance']
    },
    {
      id: 4,
      name: 'Educator',
      description: 'Education and training management',
      color: 'outline',
      userCount: 15,
      permissions: ['course_management', 'student_management', 'assessments', 'certificates']
    },
    {
      id: 5,
      name: 'Student',
      description: 'Limited access to learning resources',
      color: 'outline',
      userCount: 150,
      permissions: ['profile_view', 'course_enrollment', 'progress_tracking']
    }
  ]);

  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Super Admin', status: 'active', lastLogin: '2024-01-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-09' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'HR Manager', status: 'active', lastLogin: '2024-01-08' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Educator', status: 'inactive', lastLogin: '2024-01-05' },
    { id: 5, name: 'Bob Brown', email: 'bob@example.com', role: 'Student', status: 'active', lastLogin: '2024-01-10' },
  ]);

  const permissions = [
    { id: 'all', name: 'All Permissions', description: 'Complete system access' },
    { id: 'user_management', name: 'User Management', description: 'Create, edit, and delete users' },
    { id: 'system_config', name: 'System Configuration', description: 'Modify system settings' },
    { id: 'reports', name: 'Reports & Analytics', description: 'View and generate reports' },
    { id: 'backup', name: 'Backup & Restore', description: 'System backup operations' },
    { id: 'employee_management', name: 'Employee Management', description: 'Manage employee records' },
    { id: 'payroll', name: 'Payroll Management', description: 'Handle payroll operations' },
    { id: 'attendance', name: 'Attendance Tracking', description: 'Track employee attendance' },
    { id: 'performance', name: 'Performance Reviews', description: 'Conduct performance evaluations' },
    { id: 'course_management', name: 'Course Management', description: 'Create and manage courses' },
    { id: 'student_management', name: 'Student Management', description: 'Manage student records' },
    { id: 'assessments', name: 'Assessments', description: 'Create and manage assessments' },
    { id: 'certificates', name: 'Certificates', description: 'Issue and manage certificates' },
    { id: 'profile_view', name: 'Profile View', description: 'View own profile' },
    { id: 'course_enrollment', name: 'Course Enrollment', description: 'Enroll in courses' },
    { id: 'progress_tracking', name: 'Progress Tracking', description: 'Track learning progress' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedRole === 'all' || user.role === selectedRole)
  );

  const handleToggleUserStatus = (userId: number) => {
    toast({
      title: "User Status Updated",
      description: "User status has been successfully changed.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="professional-button">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newUserName">Full Name</Label>
                        <Input id="newUserName" className="professional-input" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserEmail">Email</Label>
                        <Input id="newUserEmail" type="email" className="professional-input" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserRole">Role</Label>
                        <Select>
                          <SelectTrigger className="professional-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full professional-button">Create User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 professional-input"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full sm:w-48 professional-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Management Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Role Management</CardTitle>
              </div>
              <CardDescription>Configure roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {roles.map((role) => (
                  <Card key={role.id} className="p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{role.name}</h3>
                          <Badge variant={role.color as any}>{role.userCount} users</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {role.permissions.slice(0, 3).map((perm) => {
                            const permission = permissions.find(p => p.id === perm);
                            return permission ? (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {permission.name}
                              </Badge>
                            ) : null;
                          })}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="mr-2 h-3 w-3" />
                              View Permissions
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{role.name} Permissions</DialogTitle>
                              <DialogDescription>
                                Manage permissions for the {role.name} role
                              </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-96 overflow-y-auto space-y-2">
                              {permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center space-x-2 p-2 border border-white/10 rounded">
                                  <Switch
                                    checked={role.permissions.includes(permission.id) || role.permissions.includes('all')}
                                    disabled={role.permissions.includes('all')}
                                  />
                                  <div className="flex-1">
                                    <Label className="font-medium">{permission.name}</Label>
                                    <p className="text-xs text-muted-foreground">{permission.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
