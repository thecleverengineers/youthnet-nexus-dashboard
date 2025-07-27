
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MobileTable, MobileTableHeader } from '@/components/ui/mobile-table';
import { MobileStatsGrid, MobileStatsCard } from '@/components/ui/mobile-stats';
import { 
  Search, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  UserX, 
  UserCheck,
  MoreHorizontal,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserForm } from './UserForm';
import { UserDetails } from './UserDetails';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

interface UserListProps {
  onUserUpdate: () => void;
}

export const UserList: React.FC<UserListProps> = ({ onUserUpdate }) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [viewingUser, setViewingUser] = useState<Profile | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      await fetchUsers();
      onUserUpdate();
      toast.success('User deleted successfully');
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      // Update user status in auth (this would typically require admin API)
      // For now, we'll update the profile role to indicate banned status
      const { error } = await supabase
        .from('profiles')
        .update({ role: ban ? 'banned' : 'student' })
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      onUserUpdate();
      toast.success(`User ${ban ? 'banned' : 'unbanned'} successfully`);
    } catch (error) {
      console.error(`Error ${ban ? 'banning' : 'unbanning'} user:`, error);
      toast.error(`Failed to ${ban ? 'ban' : 'unban'} user`);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'staff': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'trainer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'student': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'banned': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleUserFormSuccess = () => {
    fetchUsers();
    onUserUpdate();
    setEditingUser(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile columns configuration
  const mobileColumns = [
    {
      key: 'full_name',
      label: 'Name',
      render: (value: string) => (
        <div className="font-semibold text-foreground">
          {value || 'N/A'}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <div className="text-muted-foreground text-sm truncate">
          {value}
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <Badge className={getRoleBadgeColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => (
        <span className="text-sm">{value || 'N/A'}</span>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    }
  ];

  const getUserActions = (user: Profile) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 touch-manipulation hover:bg-slate-100"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open user actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => setViewingUser(user)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setEditingUser(user)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user.role !== 'banned' ? (
          <DropdownMenuItem 
            onClick={() => handleBanUser(user.id, true)}
            className="text-orange-600"
          >
            <Ban className="mr-2 h-4 w-4" />
            Ban User
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={() => handleBanUser(user.id, false)}
            className="text-green-600"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Unban User
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => setUserToDelete(user)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // User statistics
  const userStats = {
    total: filteredUsers.length,
    admin: filteredUsers.filter(u => u.role === 'admin').length,
    staff: filteredUsers.filter(u => u.role === 'staff').length,
    trainer: filteredUsers.filter(u => u.role === 'trainer').length,
    student: filteredUsers.filter(u => u.role === 'student').length,
    banned: filteredUsers.filter(u => u.role === 'banned').length,
  };

  return (
    <div className="space-y-6">
      {/* Mobile-Optimized Stats */}
      <MobileStatsGrid columns={3}>
        <MobileStatsCard
          title="Total Users"
          value={userStats.total}
          icon={UserCheck}
          trend="neutral"
        />
        <MobileStatsCard
          title="Active Users"
          value={userStats.total - userStats.banned}
          icon={CheckCircle}
          trend="up"
        />
        <MobileStatsCard
          title="Admin Users"
          value={userStats.admin}
          icon={UserX}
          trend="neutral"
        />
      </MobileStatsGrid>

      {/* Mobile-Optimized Table Header and Filters */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <MobileTableHeader
            title="System Users"
            subtitle={`Managing ${filteredUsers.length} users across the platform`}
            actions={
              <Badge variant="outline" className="text-sm">
                {filteredUsers.length} users
              </Badge>
            }
          />
          
          {/* Mobile-Friendly Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40 h-11">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin ({userStats.admin})</SelectItem>
                <SelectItem value="staff">Staff ({userStats.staff})</SelectItem>
                <SelectItem value="trainer">Trainer ({userStats.trainer})</SelectItem>
                <SelectItem value="student">Student ({userStats.student})</SelectItem>
                <SelectItem value="banned">Banned ({userStats.banned})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-medium">
                          {user.full_name || 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.phone || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {getUserActions(user)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Table */}
          <div className="lg:hidden">
            <MobileTable
              data={filteredUsers}
              columns={mobileColumns}
              keyField="id"
              actions={getUserActions}
              onRowClick={(user) => setViewingUser(user)}
              emptyMessage="No users found matching your criteria"
            />
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="p-1">
              <UserForm 
                user={editingUser}
                onSuccess={handleUserFormSuccess}
                onCancel={() => setEditingUser(null)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile-Optimized View User Dialog */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="p-1">
              <UserDetails user={viewingUser} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile-Optimized Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent className="w-full max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Delete User?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the user account
              for <strong>{userToDelete?.full_name || userToDelete?.email}</strong> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && handleDeleteUser(userToDelete.id)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
