import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Plus, Trash2, Edit, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface UserPermission {
  id: string;
  user_id: string | null;
  permission: string;
  resource: string | null;
  granted_by: string | null;
  created_at: string;
  expires_at: string | null;
  profiles?: {
    user_id: string;
    full_name: string | null;
    email: string | null;
    role: 'admin' | 'staff' | 'student' | 'trainer';
  } | null;
  granted_by_profile?: {
    user_id: string;
    full_name: string | null;
  } | null;
}

interface PermissionFormData {
  user_id: string;
  permission: string;
  resource: string;
  expires_at: string;
}

export const UserPermissions = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<UserPermission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PermissionFormData>({
    user_id: '',
    permission: '',
    resource: '*',
    expires_at: ''
  });

  // Fetch user permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['user-permissions', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('user_permissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`permission.ilike.%${searchTerm}%,resource.ilike.%${searchTerm}%`);
      }

      const { data: permissionsData, error } = await query;
      
      if (error) throw error;

      // Fetch user profiles separately
      if (permissionsData && permissionsData.length > 0) {
        const userIds = [...new Set(permissionsData.map(p => p.user_id).filter(Boolean))];
        const grantedByIds = [...new Set(permissionsData.map(p => p.granted_by).filter(Boolean))];
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, email, role')
          .in('user_id', [...userIds, ...grantedByIds]);

        // Map profiles to permissions
        const permissionsWithProfiles = permissionsData.map(permission => ({
          ...permission,
          profiles: profilesData?.find(p => p.user_id === permission.user_id) || null,
          granted_by_profile: profilesData?.find(p => p.user_id === permission.granted_by) || null
        }));

        return permissionsWithProfiles as UserPermission[];
      }

      return permissionsData as UserPermission[];
    }
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .order('full_name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add permission mutation
  const addPermissionMutation = useMutation({
    mutationFn: async (data: PermissionFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_permissions')
        .insert([{
          user_id: data.user_id,
          permission: data.permission,
          resource: data.resource,
          granted_by: user?.id,
          expires_at: data.expires_at || null
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Permission Added",
        description: "The permission has been successfully added.",
      });
      setShowForm(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add permission: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Update permission mutation
  const updatePermissionMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<PermissionFormData> }) => {
      const { error } = await supabase
        .from('user_permissions')
        .update({
          permission: data.updates.permission,
          resource: data.updates.resource,
          expires_at: data.updates.expires_at
        })
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Permission Updated",
        description: "The permission has been successfully updated.",
      });
      setEditingPermission(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update permission: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Delete permission mutation
  const deletePermissionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Permission Deleted",
        description: "The permission has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete permission: " + error.message,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      user_id: '',
      permission: '',
      resource: '*',
      expires_at: ''
    });
  };

  const handleEdit = (permission: UserPermission) => {
    setEditingPermission(permission);
    setFormData({
      user_id: permission.user_id || '',
      permission: permission.permission,
      resource: permission.resource || '*',
      expires_at: permission.expires_at ? permission.expires_at.split('T')[0] : ''
    });
  };

  const handleSubmit = () => {
    if (editingPermission) {
      updatePermissionMutation.mutate({
        id: editingPermission.id,
        updates: formData
      });
    } else {
      addPermissionMutation.mutate(formData);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            User Permissions
          </CardTitle>
          <Dialog open={showForm || !!editingPermission} onOpenChange={(open) => {
            if (!open) {
              setShowForm(false);
              setEditingPermission(null);
              resetForm();
            } else {
              setShowForm(true);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="neo-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="futuristic-card">
              <DialogHeader>
                <DialogTitle>{editingPermission ? 'Edit' : 'Add'} Permission</DialogTitle>
                <DialogDescription>
                  {editingPermission ? 'Update the permission details below.' : 'Grant a new permission to a user.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!editingPermission && (
                  <div>
                    <Label htmlFor="user">User</Label>
                    <select
                      id="user"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.full_name || user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <Label htmlFor="permission">Permission</Label>
                  <Input
                    id="permission"
                    placeholder="e.g., admin, editor, viewer"
                    value={formData.permission}
                    onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="resource">Resource</Label>
                  <Input
                    id="resource"
                    placeholder="e.g., *, /dashboard, /reports"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expires">Expires At (Optional)</Label>
                  <Input
                    id="expires"
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.user_id || !formData.permission}
                  className="neo-button"
                >
                  {editingPermission ? 'Update' : 'Add'} Permission
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          {/* Permissions Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Granted By</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {permission.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {permission.profiles?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {permission.permission}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {permission.resource}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {permission.granted_by_profile?.full_name || 'System'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {permission.expires_at ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">
                          {format(new Date(permission.expires_at), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {isExpired(permission.expires_at) ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(permission)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this permission? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePermissionMutation.mutate(permission.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {permissions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No permissions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};