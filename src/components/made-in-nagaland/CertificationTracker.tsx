
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const CertificationTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certification Tracker</CardTitle>
        <CardDescription>Track product certifications and quality standards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Certification tracking coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
