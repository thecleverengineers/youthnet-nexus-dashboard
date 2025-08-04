
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ExportCenter = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Center</CardTitle>
        <CardDescription>Export data in various formats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Data export tools coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
