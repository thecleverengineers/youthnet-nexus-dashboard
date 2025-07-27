import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RoleManagement } from './RoleManagement';
import { UserRoleAssignment } from './UserRoleAssignment';

export const AdminRBACModule = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Role-Based Access Control</h1>
        <p className="text-muted-foreground mt-2">
          Manage user roles, permissions, and access control across the system
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="assignments">
          <UserRoleAssignment />
        </TabsContent>
      </Tabs>
    </div>
  );
};