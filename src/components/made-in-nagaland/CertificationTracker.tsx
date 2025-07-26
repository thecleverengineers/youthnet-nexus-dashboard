
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, Plus, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const CertificationTracker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: certifications, isLoading } = useQuery({
    queryKey: ['product-certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_certifications')
        .select(`
          *,
          products:product_id (
            name,
            category
          )
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: products } = useQuery({
    queryKey: ['products-for-certification'],
    queryFn: async () => {
      // Mock data since products table doesn't exist yet
      return [
        { id: '1', name: 'Traditional Shawl', category: 'Textiles' },
        { id: '2', name: 'Bamboo Craft', category: 'Handicrafts' },
        { id: '3', name: 'Organic Honey', category: 'Food Products' }
      ];
    }
  });

  const createCertificationMutation = useMutation({
    mutationFn: async (certificationData: any) => {
      const { data, error } = await supabase
        .from('product_certifications')
        .insert([certificationData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-certifications'] });
      setIsDialogOpen(false);
      toast.success('Certification added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding certification: ${error.message}`);
    }
  });

  const updateCertificationMutation = useMutation({
    mutationFn: async ({ id, status }: any) => {
      const { data, error } = await supabase
        .from('product_certifications')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-certifications'] });
      toast.success('Certification status updated');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const certificationData = {
      product_id: formData.get('product_id') as string,
      certification_type: formData.get('certification_type') as string,
      certification_body: formData.get('certification_body') as string,
      issue_date: formData.get('issue_date') as string,
      expiry_date: formData.get('expiry_date') as string,
      certificate_number: formData.get('certificate_number') as string,
      status: 'active'
    };

    createCertificationMutation.mutate(certificationData);
  };

  const getStatusColor = (status: string, expiryDate: string) => {
    const isExpiringSoon = new Date(expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    switch (status) {
      case 'active': 
        return isExpiringSoon ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    return new Date(expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  };

  // Calculate summary stats
  const totalCertifications = certifications?.length || 0;
  const activeCertifications = certifications?.filter(c => c.status === 'active').length || 0;
  const expiredCertifications = certifications?.filter(c => c.status === 'expired').length || 0;
  const expiringSoon = certifications?.filter(c => c.status === 'active' && isExpiringSoon(c.expiry_date)).length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Certifications</p>
                <p className="text-3xl font-bold text-primary">{totalCertifications}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeCertifications}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-3xl font-bold text-yellow-600">{expiringSoon}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-3xl font-bold text-red-600">{expiredCertifications}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Certification Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Product Certifications
              </CardTitle>
              <CardDescription>Track product certifications and quality standards</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Certification</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="product_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select name="certification_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Certification Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="fair_trade">Fair Trade</SelectItem>
                      <SelectItem value="iso_quality">ISO Quality</SelectItem>
                      <SelectItem value="geographical_indication">Geographical Indication</SelectItem>
                      <SelectItem value="traditional_craft">Traditional Craft</SelectItem>
                      <SelectItem value="food_safety">Food Safety</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="certification_body"
                    placeholder="Certification Body"
                    required
                  />
                  
                  <Input
                    name="certificate_number"
                    placeholder="Certificate Number"
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="issue_date"
                      type="date"
                      placeholder="Issue Date"
                      required
                    />
                    <Input
                      name="expiry_date"
                      type="date"
                      placeholder="Expiry Date"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Certification
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading certifications...
            </div>
          ) : certifications?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No certifications found. Add one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>Certification Body</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications?.map((certification) => (
                  <TableRow key={certification.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">Product (Mock Data)</div>
                        <div className="text-sm text-muted-foreground">Category</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{certification.certification_type.replace('_', ' ')}</div>
                        <div className="text-sm text-muted-foreground">{certification.certificate_number}</div>
                      </div>
                    </TableCell>
                    <TableCell>{certification.certification_body}</TableCell>
                    <TableCell>{new Date(certification.issue_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className={isExpiringSoon(certification.expiry_date) ? 'text-yellow-600 font-medium' : ''}>
                        {new Date(certification.expiry_date).toLocaleDateString()}
                        {isExpiringSoon(certification.expiry_date) && (
                          <div className="text-xs text-yellow-600">Expiring Soon!</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(certification.status, certification.expiry_date)}>
                        {certification.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {certification.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCertificationMutation.mutate({
                            id: certification.id,
                            status: 'suspended'
                          })}
                        >
                          Suspend
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
