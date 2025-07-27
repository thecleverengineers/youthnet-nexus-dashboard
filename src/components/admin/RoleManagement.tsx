import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { rbacService, DynamicRole, SystemFeature, RoleFeature } from '@/services/rbacService';
import { useToast } from '@/hooks/use-toast';

export const RoleManagement = () => {
  const [roles, setRoles] = useState<DynamicRole[]>([]);
  const [features, setFeatures] = useState<SystemFeature[]>([]);
  const [roleFeatures, setRoleFeatures] = useState<Record<string, RoleFeature[]>>({});
  const [selectedRole, setSelectedRole] = useState<DynamicRole | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    is_system_role: false,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, featuresData] = await Promise.all([
        rbacService.getDynamicRoles(),
        rbacService.getSystemFeatures()
      ]);
      
      setRoles(rolesData);
      setFeatures(featuresData);

      // Fetch role features for each role
      const roleFeaturePromises = rolesData.map(role => 
        rbacService.getRoleFeatures(role.id)
      );
      const roleFeatureResults = await Promise.all(roleFeaturePromises);
      
      const roleFeatureMap: Record<string, RoleFeature[]> = {};
      rolesData.forEach((role, index) => {
        roleFeatureMap[role.id] = roleFeatureResults[index];
      });
      
      setRoleFeatures(roleFeatureMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch role management data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      await rbacService.createDynamicRole(formData);
      toast({
        title: "Success",
        description: "Role created successfully"
      });
      setIsCreateDialogOpen(false);
      setFormData({ role_name: '', description: '', is_system_role: false, is_active: true });
      fetchData();
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;
    
    try {
      await rbacService.updateDynamicRole(selectedRole.id, formData);
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    try {
      await rbacService.deleteDynamicRole(roleId);
      toast({
        title: "Success",
        description: "Role deleted successfully"
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive"
      });
    }
  };

  const handleFeatureToggle = async (roleId: string, featureId: string, isAssigned: boolean) => {
    try {
      if (isAssigned) {
        await rbacService.removeFeatureFromRole(roleId, featureId);
      } else {
        await rbacService.assignFeatureToRole(roleId, featureId);
      }
      
      // Update local state
      const updatedFeatures = await rbacService.getRoleFeatures(roleId);
      setRoleFeatures(prev => ({
        ...prev,
        [roleId]: updatedFeatures
      }));
      
      toast({
        title: "Success",
        description: `Feature ${isAssigned ? 'removed from' : 'assigned to'} role`
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature assignment",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (role: DynamicRole) => {
    setSelectedRole(role);
    setFormData({
      role_name: role.role_name,
      description: role.description || '',
      is_system_role: role.is_system_role,
      is_active: role.is_active
    });
    setIsEditDialogOpen(true);
  };

  const getFeaturesByCategory = () => {
    const categorized: Record<string, SystemFeature[]> = {};
    features.forEach(feature => {
      if (!categorized[feature.category]) {
        categorized[feature.category] = [];
      }
      categorized[feature.category].push(feature);
    });
    return categorized;
  };

  if (loading) {
    return <div className="p-6">Loading role management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">Create and manage user roles and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a new role with specific permissions and features.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role_name">Role Name</Label>
                <Input
                  id="role_name"
                  value={formData.role_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, role_name: e.target.value }))}
                  placeholder="Enter role name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_system_role"
                  checked={formData.is_system_role}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_system_role: checked }))}
                />
                <Label htmlFor="is_system_role">System Role</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <Button onClick={handleCreateRole} className="w-full">
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>Manage all system roles and their properties</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Features Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.role_name}</TableCell>
                      <TableCell>{role.description || 'No description'}</TableCell>
                      <TableCell>
                        <Badge variant={role.is_system_role ? "secondary" : "outline"}>
                          {role.is_system_role ? 'System' : 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.is_active ? "default" : "destructive"}>
                          {role.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{roleFeatures[role.id]?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(role)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!role.is_system_role && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <div className="space-y-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle>{role.role_name} Permissions</CardTitle>
                  <CardDescription>
                    Manage features assigned to {role.role_name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(getFeaturesByCategory()).map(([category, categoryFeatures]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryFeatures.map((feature) => {
                            const isAssigned = roleFeatures[role.id]?.some(
                              rf => rf.feature_id === feature.id
                            ) || false;
                            
                            return (
                              <div key={feature.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${role.id}-${feature.id}`}
                                  checked={isAssigned}
                                  onCheckedChange={() => 
                                    handleFeatureToggle(role.id, feature.id, isAssigned)
                                  }
                                />
                                <Label
                                  htmlFor={`${role.id}-${feature.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {feature.feature_name}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update the role properties and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_role_name">Role Name</Label>
              <Input
                id="edit_role_name"
                value={formData.role_name}
                onChange={(e) => setFormData(prev => ({ ...prev, role_name: e.target.value }))}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter role description"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_system_role"
                checked={formData.is_system_role}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_system_role: checked }))}
                disabled={selectedRole?.is_system_role}
              />
              <Label htmlFor="edit_is_system_role">System Role</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit_is_active">Active</Label>
            </div>
            <Button onClick={handleUpdateRole} className="w-full">
              Update Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};