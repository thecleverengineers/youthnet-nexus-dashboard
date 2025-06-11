
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const StartupApplications = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Startup Applications</CardTitle>
        <CardDescription>Review and manage startup incubation applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Startup applications management coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
