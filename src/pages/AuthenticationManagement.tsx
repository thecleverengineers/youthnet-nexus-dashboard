import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SessionManager } from '@/components/auth/SessionManager';
import { ActivityLogs } from '@/components/auth/ActivityLogs';
import { UserPermissions } from '@/components/auth/UserPermissions';
import { Shield, Activity, Users, Lock } from 'lucide-react';

export const AuthenticationManagement = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-gradient">Authentication & Security</h1>
          <p className="text-muted-foreground">
            Comprehensive security management and user access control
          </p>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Session Manager
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <SessionManager />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <ActivityLogs />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <UserPermissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};