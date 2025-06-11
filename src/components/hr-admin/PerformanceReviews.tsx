
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PerformanceReviews = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Reviews</CardTitle>
        <CardDescription>Conduct and manage employee performance evaluations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Performance review system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
