import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, Shield, UserCheck } from 'lucide-react';

interface UserRole {
  id: string;
  role_name: string;
  description: string;
  permissions: any;
  is_active: boolean;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface RoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  profiles?: User;
  user_roles?: UserRole;
}

export const UserPermissions = () => {
  const { profile } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<UserRole | null>(null);

  const [roleForm, setRoleForm] = useState({
    role_name: '',
    description: '',
    permissions: {}
  });

  const [assignForm, setAssignForm] = useState({
    user_id: '',
    role_id: ''
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      const [rolesResponse, usersResponse, assignmentsResponse] = await Promise.all([
        supabase.from('user_roles').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('full_name', { ascending: true }),
        supabase.from('user_role_assignments').select('*').order('assigned_at', { ascending: false })
      ]);

      if (rolesResponse.error) throw rolesResponse.error;
      if (usersResponse.error) throw usersResponse.error;
      if (assignmentsResponse.error) throw assignmentsResponse.error;

      setRoles(rolesResponse.data || []);
      setUsers(usersResponse.data || []);
      
      // Process assignments with user and role data
      const processedAssignments = (assignmentsResponse.data || []).map(assignment => {
        const user = usersResponse.data?.find(u => u.id === assignment.user_id);
        const role = rolesResponse.data?.find(r => r.id === assignment.role_id);
        return {
          ...assignment,
          profiles: user,
          user_roles: role
        };
      });
      
      setAssignments(processedAssignments);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load permissions data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        const { error } = await supabase
          .from('user_roles')
          .update({
            role_name: roleForm.role_name,
            description: roleForm.description,
            permissions: roleForm.permissions
          })
          .eq('id', editingRole.id);

        if (error) throw error;
        toast.success('Role updated successfully');
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({
            role_name: roleForm.role_name,
            description: roleForm.description,
            permissions: roleForm.permissions
          });

        if (error) throw error;
        toast.success('Role created successfully');
      }

      setDialogOpen(false);
      setEditingRole(null);
      setRoleForm({ role_name: '', description: '', permissions: {} });
      fetchData();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This will remove all user assignments.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
      toast.success('Role deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const handleAssignRole = async () => {
    try {
      const { error } = await supabase
        .from('user_role_assignments')
        .insert({
          user_id: assignForm.user_id,
          role_id: assignForm.role_id,
          assigned_by: profile?.id
        });

      if (error) throw error;
      toast.success('Role assigned successfully');
      setAssignDialogOpen(false);
      setAssignForm({ user_id: '', role_id: '' });
      fetchData();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('user_role_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
      toast.success('Role assignment removed successfully');
      fetchData();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast.error('Failed to remove assignment');
    }
  };

  const openEditDialog = (role: UserRole) => {
    setEditingRole(role);
    setRoleForm({
      role_name: role.role_name,
      description: role.description || '',
      permissions: role.permissions || {}
    });
    setDialogOpen(true);
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Access denied. Admin privileges required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading user permissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Roles Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Roles
              </CardTitle>
              <CardDescription>Manage system roles and their permissions</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                  <DialogDescription>
                    Define role name, description, and permissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input
                      id="role-name"
                      value={roleForm.role_name}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, role_name: e.target.value }))}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-description">Description</Label>
                    <Textarea
                      id="role-description"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter role description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveRole}>
                    {editingRole ? 'Update' : 'Create'} Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.role_name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Badge variant={role.is_active ? "default" : "secondary"}>
                      {role.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Role Assignments
              </CardTitle>
              <CardDescription>Assign roles to users</CardDescription>
            </div>
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Role to User</DialogTitle>
                  <DialogDescription>
                    Select a user and role to create assignment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select User</Label>
                    <Select value={assignForm.user_id} onValueChange={(value) => 
                      setAssignForm(prev => ({ ...prev, user_id: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Role</Label>
                    <Select value={assignForm.role_id} onValueChange={(value) => 
                      setAssignForm(prev => ({ ...prev, role_id: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.filter(role => role.is_active).map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.role_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignRole}>
                    Assign Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.profiles?.full_name || 'Unknown'}
                  </TableCell>
                  <TableCell>{assignment.profiles?.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {assignment.user_roles?.role_name}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};