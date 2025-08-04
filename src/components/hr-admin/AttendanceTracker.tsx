
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const AttendanceTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Tracker</CardTitle>
        <CardDescription>Track employee attendance and working hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Attendance tracking system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
