
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const InstructorManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instructor Management</CardTitle>
        <CardDescription>Manage course instructors and their assignments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Instructor management features coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
