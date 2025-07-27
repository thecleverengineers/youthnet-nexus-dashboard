import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Trash2 } from 'lucide-react';
import { rbacService } from '@/services/rbacService';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface Role {
  id: string;
  role_name: string;
  description?: string;
}

interface Assignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  is_active: boolean;
}

export const UserRoleAssignment = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, assignmentsData] = await Promise.all([
        rbacService.getAllUsers(),
        rbacService.getDynamicRoles(),
        rbacService.getUserRoleAssignments()
      ]);
      
      setUsers(usersData);
      setRoles(rolesData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user role assignment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: "Error",
        description: "Please select both a user and a role",
        variant: "destructive"
      });
      return;
    }

    try {
      await rbacService.assignRoleToUser(selectedUser, selectedRole);
      toast({
        title: "Success",
        description: "Role assigned successfully"
      });
      setIsAssignDialogOpen(false);
      setSelectedUser('');
      setSelectedRole('');
      fetchData();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAssignment = async (userId: string, roleId: string) => {
    if (!confirm('Are you sure you want to remove this role assignment?')) return;

    try {
      await rbacService.removeRoleFromUser(userId, roleId);
      toast({
        title: "Success",
        description: "Role assignment removed successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove role assignment",
        variant: "destructive"
      });
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.full_name || user.email : 'Unknown User';
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.role_name : 'Unknown Role';
  };

  if (loading) {
    return <div className="p-6">Loading user role assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Role Assignments</h2>
          <p className="text-muted-foreground">Assign roles to users and manage their access</p>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role to User</DialogTitle>
              <DialogDescription>
                Select a user and role to create a new assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select User</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Select Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignRole} className="w-full">
                Assign Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Role Assignments</CardTitle>
          <CardDescription>View and manage all user role assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const user = users.find(u => u.id === assignment.user_id);
                const role = roles.find(r => r.id === assignment.role_id);
                
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {user?.full_name || 'Unknown User'}
                    </TableCell>
                    <TableCell>{user?.email || 'Unknown Email'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role?.role_name || 'Unknown Role'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAssignment(assignment.user_id, assignment.role_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No role assignments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
          <CardDescription>All users in the system and their current roles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Assigned Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userAssignments = assignments.filter(a => a.user_id === user.id);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'Unknown'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userAssignments.map((assignment) => {
                          const role = roles.find(r => r.id === assignment.role_id);
                          return (
                            <Badge key={assignment.id} variant="outline">
                              {role?.role_name || 'Unknown'}
                            </Badge>
                          );
                        })}
                        {userAssignments.length === 0 && (
                          <span className="text-muted-foreground text-sm">No assigned roles</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};