
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ReportGenerator = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>Create custom reports across all departments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Report generation tools coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
