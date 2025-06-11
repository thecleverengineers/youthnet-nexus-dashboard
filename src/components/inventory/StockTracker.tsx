
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const StockTracker = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Tracker</CardTitle>
        <CardDescription>Monitor inventory levels and stock movements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Stock tracking system coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
