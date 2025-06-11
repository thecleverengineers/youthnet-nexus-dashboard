
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const MaintenanceScheduler = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Scheduler</CardTitle>
        <CardDescription>Schedule and track equipment maintenance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Maintenance scheduling system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
