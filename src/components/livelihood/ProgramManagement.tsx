
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ProgramManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Management</CardTitle>
        <CardDescription>Create and manage livelihood development programs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Livelihood program management coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
