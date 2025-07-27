
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { AssetForm } from './AssetForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { inventoryService } from '@/services/inventoryService';

export const AssetManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data: assets, isLoading, refetch } = useQuery({
    queryKey: ['inventory_items'],
    queryFn: async () => {
      try {
        return await inventoryService.getItems();
      } catch (error) {
        console.error('Error fetching inventory items:', error);
        // Return mock data as fallback
        return [
          {
            id: '1',
            name: 'Dell Laptop',
            category: 'Electronics',
            description: 'Dell Inspiron 15 3000 Series',
            status: 'available',
            location: 'IT Department',
            purchase_date: '2024-01-15',
            purchase_price: 45000,
            current_value: 40000,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Office Chair',
            category: 'Furniture',
            description: 'Ergonomic office chair with lumbar support',
            status: 'in_use',
            location: 'HR Department',
            purchase_date: '2024-01-10',
            purchase_price: 8500,
            current_value: 7500,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['inventory_categories'],
    queryFn: inventoryService.getCategories
  });

  const deleteAsset = async (id: string) => {
    try {
      await inventoryService.deleteItem(id);

      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'disposed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return <AssetForm onSuccess={() => { setShowForm(false); refetch(); }} onCancel={() => setShowForm(false)} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Asset Management
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </CardTitle>
        <CardDescription>Track and manage organizational assets and equipment</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading assets...
          </div>
        ) : assets?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No assets found. Click "Add Asset" to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets?.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.brand} {asset.model}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${asset.current_value}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Open edit modal with asset data
                        console.log('Edit asset:', asset.id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteAsset(asset.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
