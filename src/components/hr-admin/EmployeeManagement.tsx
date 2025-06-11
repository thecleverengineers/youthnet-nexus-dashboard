
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const EmployeeManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Management</CardTitle>
        <CardDescription>Manage employee records and organizational structure</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Employee management system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
