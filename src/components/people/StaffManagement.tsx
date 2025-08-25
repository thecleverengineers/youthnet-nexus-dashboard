import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Calendar, Building, DollarSign, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EmployeeForm } from '@/components/hr-admin/EmployeeForm';
import { StaffDataImport } from '@/components/hr-admin/StaffDataImport';

export const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewStaff, setViewStaff] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    employment_status: 'active',
    employment_type: 'full_time',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 0
  });

  // Fetch employees with profiles
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff-management'],
    queryFn: async () => {
      const { data: employeesData, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const employeesWithProfiles = await Promise.all(
        (employeesData || []).map(async (employee) => {
          if (employee.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, phone, address')
              .eq('user_id', employee.user_id)
              .maybeSingle();
            
            return { ...employee, profiles: profile || undefined };
          }
          return { ...employee, profiles: undefined };
        })
      );

      return employeesWithProfiles;
    }
  });

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const userId = crypto.randomUUID();
      
      // First create a profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          role: 'staff'
        });

      if (profileError) throw profileError;

      // Then create the employee
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert({
          employee_id: data.employee_id,
          user_id: userId,
          position: data.position,
          department: data.department,
          employment_status: data.employment_status,
          employment_type: data.employment_type,
          hire_date: data.hire_date,
          salary: data.salary
        })
        .select()
        .single();

      if (employeeError) throw employeeError;
      return employee;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      toast({ title: 'Staff member created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating staff member', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update staff mutation
  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      // Update employee
      const { error: employeeError } = await supabase
        .from('employees')
        .update({
          employee_id: data.employee_id,
          position: data.position,
          department: data.department,
          employment_status: data.employment_status,
          employment_type: data.employment_type,
          hire_date: data.hire_date,
          salary: data.salary
        })
        .eq('id', id);

      if (employeeError) throw employeeError;

      // Update profile if user_id exists
      const employee = staff.find(s => s.id === id);
      if (employee?.user_id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            address: data.address
          })
          .eq('user_id', employee.user_id);

        if (profileError) throw profileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      toast({ title: 'Staff member updated successfully' });
      setEditingStaff(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating staff member', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      toast({ title: 'Staff member deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error deleting staff member', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const chunkSize = 50; // keep URL under limits
      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const { error } = await supabase
          .from('employees')
          .delete()
          .in('id', chunk);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-management'] });
      toast({ title: `${selectedIds.length} staff members deleted successfully` });
      setSelectedIds([]);
      setShowDeleteConfirm(false);
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error deleting staff members', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const filteredStaff = staff.filter(employee => {
    const matchesSearch = 
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.employment_status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      employee_id: '',
      full_name: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      department: '',
      employment_status: 'active',
      employment_type: 'full_time',
      hire_date: new Date().toISOString().split('T')[0],
      salary: 0
    });
  };

  const handleEdit = (employee: any) => {
    setEditingStaff(employee);
    setFormData({
      employee_id: employee.employee_id,
      full_name: employee.profiles?.full_name || '',
      email: employee.profiles?.email || '',
      phone: employee.profiles?.phone || '',
      address: employee.profiles?.address || '',
      position: employee.position || '',
      department: employee.department || '',
      employment_status: employee.employment_status || 'active',
      employment_type: employee.employment_type || 'full_time',
      hire_date: employee.hire_date || new Date().toISOString().split('T')[0],
      salary: employee.salary || 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaffMutation.mutate({ id: editingStaff.id, data: formData });
    } else {
      createStaffMutation.mutate(formData);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'probation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'on_leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'terminated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'full_time': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'part_time': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'contract': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'intern': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'consultant': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(staff.map(s => s.department).filter(Boolean))];

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredStaff.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">{staff.length}</div>
            <p className="text-sm text-muted-foreground">Total Staff</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-emerald-400">
              {staff.filter(s => s.employment_status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Staff</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-400">
              {staff.filter(s => s.employment_type === 'full_time').length}
            </div>
            <p className="text-sm text-muted-foreground">Full Time</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-400">
              {staff.filter(s => !s.profiles).length}
            </div>
            <p className="text-sm text-muted-foreground">Without Profile</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staff Management</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowImportDialog(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Excel
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Button 
                  onClick={() => {
                    setEditingStaff(null);
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Staff Member
                </Button>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                    </DialogTitle>
                  </DialogHeader>
                  <EmployeeForm 
                    employee={editingStaff}
                    onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ['staff-management'] });
                      setIsDialogOpen(false);
                      setEditingStaff(null);
                      resetForm();
                    }}
                    onCancel={() => {
                      setIsDialogOpen(false);
                      setEditingStaff(null);
                      resetForm();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selection Bar */}
          {filteredStaff.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedIds.length === filteredStaff.length && filteredStaff.length > 0}
                  onCheckedChange={(val) => handleSelectAll(Boolean(val))}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length > 0 
                    ? `${selectedIds.length} of ${filteredStaff.length} selected`
                    : 'Select all'
                  }
                </span>
              </div>
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
            </div>
          )}

          {/* Staff Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading staff...</div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No staff members found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((employee) => (
                <Card key={employee.id} className="futuristic-card hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedIds.includes(employee.id)}
                          onCheckedChange={(checked) => handleSelectOne(employee.id, checked as boolean)}
                        />
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white">
                            {employee.profiles?.full_name?.split(' ').map(n => n[0]).join('') || employee.employee_id.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {employee.profiles?.full_name || `Staff ${employee.employee_id}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">{employee.employee_id}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewStaff(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleEdit(employee);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this staff member?')) {
                              deleteStaffMutation.mutate(employee.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(employee.employment_status)}>
                          {employee.employment_status?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                        <Badge className={getTypeColor(employee.employment_type)}>
                          {employee.employment_type?.replace('_', ' ') || 'Unknown'}
                        </Badge>
                      </div>
                      {!employee.profiles && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          No Profile
                        </Badge>
                      )}
                      <div className="text-muted-foreground">
                        <Building className="h-3 w-3 inline mr-1" />
                        {employee.position} - {employee.department}
                      </div>
                      {employee.profiles?.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{employee.profiles.email}</span>
                        </div>
                      )}
                      {employee.hire_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Hired: {new Date(employee.hire_date).toLocaleDateString()}</span>
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

      {/* View Staff Dialog */}
      <Dialog open={!!viewStaff} onOpenChange={() => setViewStaff(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Staff Member Details</DialogTitle>
          </DialogHeader>
          {viewStaff && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white text-xl">
                    {viewStaff.profiles?.full_name?.split(' ').map(n => n[0]).join('') || viewStaff.employee_id.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewStaff.profiles?.full_name || `Staff ${viewStaff.employee_id}`}
                  </h3>
                  <p className="text-muted-foreground">{viewStaff.employee_id}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className={getStatusColor(viewStaff.employment_status)}>
                      {viewStaff.employment_status?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                    <Badge className={getTypeColor(viewStaff.employment_type)}>
                      {viewStaff.employment_type?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-muted-foreground">
                    {viewStaff.profiles?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-muted-foreground">
                    {viewStaff.profiles?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label>Position</Label>
                  <p className="text-muted-foreground">
                    {viewStaff.position || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-muted-foreground">
                    {viewStaff.department || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Hire Date</Label>
                  <p className="text-muted-foreground">
                    {viewStaff.hire_date ? new Date(viewStaff.hire_date).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <Label>Salary</Label>
                  <p className="text-muted-foreground">
                    ${viewStaff.salary?.toLocaleString() || 'Not specified'}
                  </p>
                </div>
              </div>

              {viewStaff.profiles?.address && (
                <div>
                  <Label>Address</Label>
                  <p className="text-muted-foreground">{viewStaff.profiles.address}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.length} Staff Members?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected staff members and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bulkDeleteMutation.mutate(selectedIds)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Excel Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Staff Data from Excel</DialogTitle>
          </DialogHeader>
          <StaffDataImport />
        </DialogContent>
      </Dialog>
    </div>
  );
};