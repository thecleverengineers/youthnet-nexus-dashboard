
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AssetManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Management</CardTitle>
        <CardDescription>Track and manage organizational assets and equipment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Asset management system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
