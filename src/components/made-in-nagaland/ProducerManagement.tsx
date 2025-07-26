
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Factory, Star } from 'lucide-react';
import { toast } from 'sonner';

export const ProducerManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: producers, isLoading } = useQuery({
    queryKey: ['producers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('producers')
        .select('*')
        .order('producer_name');
      if (error) throw error;
      return data || [];
    }
  });

  const createProducerMutation = useMutation({
    mutationFn: async (producerData: any) => {
      const { data, error } = await supabase
        .from('producers')
        .insert([producerData])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['producers'] });
      setIsDialogOpen(false);
      toast.success('Producer added successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const producerData = {
      producer_name: formData.get('producer_name') as string,
      contact_person: formData.get('contact_person') as string,
      contact_email: formData.get('contact_email') as string,
      contact_phone: formData.get('contact_phone') as string,
      address: formData.get('address') as string,
      monthly_capacity: parseInt(formData.get('monthly_capacity') as string),
      quality_rating: parseFloat(formData.get('quality_rating') as string),
      production_categories: (formData.get('production_categories') as string).split(',').map(c => c.trim())
    };

    createProducerMutation.mutate(producerData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              Producer Management
            </CardTitle>
            <CardDescription>Manage local producers and their profiles</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Producer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Producer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="producer_name" placeholder="Producer Name" required />
                <Input name="contact_person" placeholder="Contact Person" />
                <Input name="contact_email" type="email" placeholder="Email" />
                <Input name="contact_phone" placeholder="Phone" />
                <Input name="address" placeholder="Address" />
                <Input name="monthly_capacity" type="number" placeholder="Monthly Capacity" />
                <Input name="quality_rating" type="number" step="0.1" min="0" max="5" placeholder="Quality Rating (0-5)" />
                <Input name="production_categories" placeholder="Categories (comma-separated)" />
                <Button type="submit" className="w-full">Add Producer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading producers...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {producers?.map((producer) => (
                <TableRow key={producer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{producer.producer_name}</div>
                      <div className="text-sm text-muted-foreground">{producer.contact_person}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{producer.contact_email}</div>
                      <div>{producer.contact_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{producer.monthly_capacity || 0}/month</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {producer.quality_rating || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(producer.status)}>
                      {producer.status}
                    </Badge>
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
