
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  Settings, 
  Activity,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  phone?: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const UserPermissions = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [editingRole, setEditingRole] = useState('');

  // Check if current user is super admin
  const isSuperAdmin = profile?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllData();
    }
  }, [isSuperAdmin]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchActivityLogs(),
        fetchSystemSettings()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } else {
      setUsers(data || []);
    }
  };

  const fetchActivityLogs = async () => {
    const { data, error } = await supabase
      .from('user_activity_logs')
      .select(`
        *,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching activity logs:', error);
      toast.error('Failed to fetch activity logs');
    } else {
      setActivityLogs(data || []);
    }
  };

  const fetchSystemSettings = async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key');

    if (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to fetch system settings');
    } else {
      setSystemSettings(data || []);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Log the activity
      await supabase.from('user_activity_logs').insert({
        user_id: userId,
        activity_type: 'role_change',
        activity_description: `Role changed to ${newRole}`,
        metadata: { old_role: selectedUser?.role, new_role: newRole, changed_by: profile?.id }
      });

      toast.success('User role updated successfully');
      fetchUsers();
      fetchActivityLogs();
      setShowUserDialog(false);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const updateSystemSetting = async (settingId: string, newValue: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: newValue,
          updated_by: profile?.id 
        })
        .eq('id', settingId);

      if (error) throw error;

      toast.success('System setting updated successfully');
      fetchSystemSettings();
    } catch (error) {
      console.error('Error updating system setting:', error);
      toast.error('Failed to update system setting');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'admin': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'staff': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'trainer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'student': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-400" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Only Super Administrators can access user permissions management.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-400" />
                Super Admin Control Panel
              </CardTitle>
              <CardDescription>
                Manage all users, roles, activities, and system settings
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={fetchAllData}
              disabled={loading}
              className="hover:bg-blue-500/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.full_name || user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.phone && (
                            <p className="text-xs text-muted-foreground">{user.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditingRole(user.role);
                            setShowUserDialog(true);
                          }}
                          className="hover:bg-blue-500/20"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit Role
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Recent Activity Logs</CardTitle>
              <CardDescription>Monitor all user activities across the system</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {log.activity_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {log.profiles?.full_name || log.profiles?.email || 'Unknown User'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white">{log.activity_description}</p>
                      {log.metadata && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">
                            View metadata
                          </summary>
                          <pre className="text-xs bg-background/50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Manage global system settings and website configuration</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {systemSettings.map((setting) => (
                    <div key={setting.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-white">{setting.setting_key.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={setting.is_public ? "default" : "secondary"} className="text-xs">
                            {setting.is_public ? 'Public' : 'Private'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {setting.setting_type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {setting.setting_type === 'boolean' ? (
                          <Button
                            variant={JSON.parse(setting.setting_value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateSystemSetting(setting.id, !JSON.parse(setting.setting_value))}
                            className="flex items-center gap-1"
                          >
                            {JSON.parse(setting.setting_value) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            {JSON.parse(setting.setting_value) ? 'Enabled' : 'Disabled'}
                          </Button>
                        ) : (
                          <div className="flex-1">
                            <Input
                              value={JSON.parse(setting.setting_value)}
                              onChange={(e) => {
                                const newValue = setting.setting_type === 'number' 
                                  ? parseInt(e.target.value) || 0 
                                  : e.target.value;
                                updateSystemSetting(setting.id, newValue);
                              }}
                              type={setting.setting_type === 'number' ? 'number' : 'text'}
                              className="text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Role Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">New Role</Label>
              <Select value={editingRole} onValueChange={setEditingRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Administrator</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => selectedUser && updateUserRole(selectedUser.id, editingRole)}
                className="flex-1"
              >
                Update Role
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUserDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
