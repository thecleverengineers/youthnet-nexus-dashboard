
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const SystemConfiguration = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <CardDescription>Configure system-wide settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          System configuration panel coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
