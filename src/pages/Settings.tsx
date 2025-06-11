
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemConfiguration } from '@/components/settings/SystemConfiguration';
import { UserPermissions } from '@/components/settings/UserPermissions';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { BackupRestore } from '@/components/settings/BackupRestore';

export const Settings = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-2">Configure system preferences and manage user access</p>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="permissions">User Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <SystemConfiguration />
        </TabsContent>

        <TabsContent value="permissions">
          <UserPermissions />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="backup">
          <BackupRestore />
        </TabsContent>
      </Tabs>
    </div>
  );
};
