
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ProductCatalog = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Catalog</CardTitle>
        <CardDescription>Manage local products and their listings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          Product catalog management coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
