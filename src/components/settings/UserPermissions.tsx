
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const UserPermissions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Permissions</CardTitle>
        <CardDescription>Manage user roles and access permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          User permission management coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
