
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { UserStats } from './UserStats';
import { Users, UserPlus, BarChart3 } from 'lucide-react';

export const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-gray-600 mt-2">Manage system users, roles, and access permissions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="add-user" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserList key={refreshKey} onUserUpdate={handleUserUpdate} />
        </TabsContent>

        <TabsContent value="add-user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <UserForm 
                onSuccess={() => {
                  handleUserUpdate();
                  setActiveTab('users');
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <UserStats key={refreshKey} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
