
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const FundingTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Tracker</CardTitle>
        <CardDescription>Track funding applications and disbursements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Funding tracker coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
