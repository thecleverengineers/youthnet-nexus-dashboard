
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ParticipantTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Participant Tracker</CardTitle>
        <CardDescription>Track program participants and their progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Participant tracking coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
