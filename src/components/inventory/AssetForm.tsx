
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AssetFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AssetForm = ({ onSuccess, onCancel }: AssetFormProps) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert([{
          name: data.name,
          category: data.category,
          description: data.description,
          brand: data.brand,
          model: data.model,
          serial_number: data.serial_number,
          location: data.location,
          purchase_date: data.purchase_date,
          purchase_price: parseFloat(data.purchase_price) || 0,
          current_value: parseFloat(data.current_value) || 0,
          status: data.status || 'available'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Asset added successfully",
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Error",
        description: "Failed to add asset",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Asset Name</Label>
              <Input id="name" {...register('name', { required: true })} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register('category', { required: true })} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register('brand')} />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input id="model" {...register('model')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input id="serial_number" {...register('serial_number')} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register('location')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input id="purchase_date" type="date" {...register('purchase_date')} />
            </div>
            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <Input id="purchase_price" type="number" step="0.01" {...register('purchase_price')} />
            </div>
          </div>

          <div>
            <Label htmlFor="current_value">Current Value</Label>
            <Input id="current_value" type="number" step="0.01" {...register('current_value')} />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Add Asset</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
