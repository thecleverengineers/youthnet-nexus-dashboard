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
  user_id: string;
  permission_name: string;
  resource_type: string;
  granted_by: string;
  granted_at: string;
  expires_at: string;
  is_active: boolean;
  profiles?: {
    full_name: string;
    email: string;
    role: string;
  } | null;
  granted_by_profile?: {
    full_name: string;
  } | null;
}

interface PermissionFormData {
  user_id: string;
  permission_name: string;
  resource_type: string;
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
    permission_name: '',
    resource_type: '*',
    expires_at: ''
  });

  // Fetch permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['user-permissions', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('user_permissions')
        .select('*')
        .order('granted_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`permission_name.ilike.%${searchTerm}%,resource_type.ilike.%${searchTerm}%`);
      }

      const { data: permissionsData, error } = await query;
      if (error) throw error;

      // Fetch user profiles separately
      if (permissionsData && permissionsData.length > 0) {
        const userIds = [...new Set(permissionsData.map(p => p.user_id))];
        const grantedByIds = [...new Set(permissionsData.map(p => p.granted_by).filter(Boolean))];
        
        const [{ data: profilesData }, { data: grantedByData }] = await Promise.all([
          supabase.from('profiles').select('user_id, full_name, email, role').in('user_id', userIds),
          supabase.from('profiles').select('user_id, full_name').in('user_id', grantedByIds)
        ]);

        // Map profiles to permissions
        const permissionsWithProfiles = permissionsData.map(permission => ({
          ...permission,
          profiles: profilesData?.find(p => p.user_id === permission.user_id) || null,
          granted_by_profile: grantedByData?.find(p => p.user_id === permission.granted_by) || null
        }));

        return permissionsWithProfiles as UserPermission[];
      }

      return permissionsData as UserPermission[];
    }
  });

  // Fetch users for dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['users-for-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, role')
        .order('full_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Create/Update permission mutation
  const savePermissionMutation = useMutation({
    mutationFn: async (data: PermissionFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const permissionData = {
        ...data,
        granted_by: user?.id,
        expires_at: data.expires_at || null
      };

      if (editingPermission) {
        const { error } = await supabase
          .from('user_permissions')
          .update(permissionData)
          .eq('id', editingPermission.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_permissions')
          .insert([permissionData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      setShowForm(false);
      setEditingPermission(null);
      setFormData({ user_id: '', permission_name: '', resource_type: '*', expires_at: '' });
      toast({
        title: editingPermission ? "Permission Updated" : "Permission Granted",
        description: `Permission has been successfully ${editingPermission ? 'updated' : 'granted'}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save permission: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Revoke permission mutation
  const revokePermissionMutation = useMutation({
    mutationFn: async (permissionId: string) => {
      const { error } = await supabase
        .from('user_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      toast({
        title: "Permission Revoked",
        description: "The permission has been successfully revoked.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to revoke permission: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleEdit = (permission: UserPermission) => {
    setEditingPermission(permission);
    setFormData({
      user_id: permission.user_id,
      permission_name: permission.permission_name,
      resource_type: permission.resource_type,
      expires_at: permission.expires_at ? format(new Date(permission.expires_at), 'yyyy-MM-dd') : ''
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePermissionMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({ user_id: '', permission_name: '', resource_type: '*', expires_at: '' });
    setEditingPermission(null);
    setShowForm(false);
  };

  const isExpired = (expiresAt: string) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  const getPermissionColor = (permission: UserPermission) => {
    if (!permission.is_active) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (isExpired(permission.expires_at)) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getPermissionStatus = (permission: UserPermission) => {
    if (!permission.is_active) return 'Revoked';
    if (isExpired(permission.expires_at)) return 'Expired';
    return 'Active';
  };

  const predefinedPermissions = [
    'all', 'hr_management', 'education_management', 'student_access', 'inventory_management',
    'reports_access', 'user_management', 'system_admin', 'read_only', 'write_access'
  ];

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
              {[1, 2, 3, 4, 5].map((i) => (
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
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Grant Permission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingPermission ? 'Edit Permission' : 'Grant New Permission'}
                  </DialogTitle>
                  <DialogDescription>
                    Assign specific permissions to users for resource access control.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">User</Label>
                    <select
                      id="user"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      required
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.user_id} value={user.user_id}>
                          {user.full_name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permission">Permission</Label>
                    <select
                      id="permission"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      value={formData.permission_name}
                      onChange={(e) => setFormData({ ...formData, permission_name: e.target.value })}
                      required
                    >
                      <option value="">Select permission</option>
                      {predefinedPermissions.map((perm) => (
                        <option key={perm} value={perm}>
                          {perm.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resource_type">Resource Type</Label>
                    <Input
                      id="resource_type"
                      value={formData.resource_type}
                      onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                      placeholder="e.g., students, courses, * (for all)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savePermissionMutation.isPending}>
                    {savePermissionMutation.isPending ? 'Saving...' : (editingPermission ? 'Update' : 'Grant')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search permissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Granted By</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
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
                    <Badge variant="outline">
                      {permission.permission_name.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {permission.resource_type}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPermissionColor(permission)}>
                      {getPermissionStatus(permission)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {permission.granted_by_profile?.full_name || 'System'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {permission.expires_at ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(permission.expires_at), 'MMM dd, yyyy')}
                        </div>
                      ) : (
                        'Never'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(permission)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={!permission.is_active}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Permission?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently revoke this permission from the user. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => revokePermissionMutation.mutate(permission.id)}
                              disabled={revokePermissionMutation.isPending}
                            >
                              Revoke
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