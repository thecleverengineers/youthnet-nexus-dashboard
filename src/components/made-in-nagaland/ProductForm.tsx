
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductForm = ({ onSuccess, onCancel }: ProductFormProps) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('local_products')
        .insert([{
          product_name: data.product_name,
          category: data.category,
          description: data.description,
          producer_name: data.producer_name,
          producer_contact: data.producer_contact,
          price: parseFloat(data.price) || null,
          stock_quantity: parseInt(data.stock_quantity) || 0
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product_name">Product Name</Label>
              <Input id="product_name" {...register('product_name', { required: true })} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register('category', { required: true })} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="producer_name">Producer Name</Label>
              <Input id="producer_name" {...register('producer_name', { required: true })} />
            </div>
            <div>
              <Label htmlFor="producer_contact">Producer Contact</Label>
              <Input id="producer_contact" {...register('producer_contact')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
            </div>
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input id="stock_quantity" type="number" {...register('stock_quantity')} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Add Product</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
