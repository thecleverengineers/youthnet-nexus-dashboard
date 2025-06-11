
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const InventoryReports = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Reports</CardTitle>
        <CardDescription>Generate inventory and asset reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Inventory reporting system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
