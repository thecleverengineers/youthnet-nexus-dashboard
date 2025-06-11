
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PayrollManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Management</CardTitle>
        <CardDescription>Manage employee salaries and payroll processing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Payroll management system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
