
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const OutcomeAssessment = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Outcome Assessment</CardTitle>
        <CardDescription>Assess program outcomes and effectiveness</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Outcome assessment tools coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
