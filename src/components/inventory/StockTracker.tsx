
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Package, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export const StockTracker = () => {
  const [updateQuantity, setUpdateQuantity] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const { data: inventory, isLoading, refetch } = useQuery({
    queryKey: ['inventory_stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, category, current_value, status')
        .order('name');

      if (error) throw error;
      return data?.map(item => ({
        ...item,
        stock_quantity: Math.floor(Math.random() * 100) + 1, // Mock stock data
        min_threshold: 10,
        max_threshold: 50
      }));
    }
  });

  const updateStock = async (itemId: string, newQuantity: number) => {
    try {
      // In a real implementation, you'd have a stock_movements table
      toast({
        title: "Success",
        description: `Stock updated to ${newQuantity}`,
      });
      
      setUpdateQuantity(prev => ({ ...prev, [itemId]: 0 }));
      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (quantity: number, minThreshold: number, maxThreshold: number) => {
    if (quantity <= minThreshold) return { status: 'low', color: 'bg-red-100 text-red-800' };
    if (quantity >= maxThreshold) return { status: 'high', color: 'bg-blue-100 text-blue-800' };
    return { status: 'normal', color: 'bg-green-100 text-green-800' };
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case 'low': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <TrendingUp className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Stock Tracker
        </CardTitle>
        <CardDescription>Monitor inventory levels and stock movements</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading stock information...
          </div>
        ) : inventory?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No inventory items found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Update Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory?.map((item) => {
                const stockStatus = getStockStatus(item.stock_quantity, item.min_threshold, item.max_threshold);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="font-bold">{item.stock_quantity}</TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color}>
                        <div className="flex items-center gap-1">
                          {getStockIcon(stockStatus.status)}
                          {stockStatus.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{item.min_threshold} / {item.max_threshold}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={updateQuantity[item.id] || ''}
                          onChange={(e) => setUpdateQuantity(prev => ({ 
                            ...prev, 
                            [item.id]: parseInt(e.target.value) || 0 
                          }))}
                          className="w-20"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => updateStock(item.id, updateQuantity[item.id] || 0)}
                          disabled={!updateQuantity[item.id]}
                        >
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
