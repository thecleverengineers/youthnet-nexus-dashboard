
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const IncubationPrograms = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incubation Programs</CardTitle>
        <CardDescription>Manage incubation program schedules and content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Incubation programs management coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
