
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Phone,
  Mail,
  MapPin,
  Package,
  Star,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

interface Producer {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  category: string;
  specializations: string[];
  productsCount: number;
  rating: number;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
  certifications: string[];
  monthlyRevenue: number;
  description: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
}

export const ProducerManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [producers, setProducers] = useState<Producer[]>([
    {
      id: '1',
      name: 'Mary Konyak',
      businessName: 'Heritage Weavers',
      email: 'mary@heritageweav.com',
      phone: '+91 98765 43210',
      address: 'Mon Town, Mon District',
      district: 'Mon',
      category: 'Textiles & Handicrafts',
      specializations: ['Traditional Weaving', 'Shawls', 'Bags'],
      productsCount: 45,
      rating: 4.8,
      registrationDate: '2023-06-15',
      status: 'active',
      certifications: ['Handloom Mark', 'GI Tag'],
      monthlyRevenue: 85000,
      description: 'Specializes in traditional Naga textiles with over 20 years of experience.',
      website: 'https://heritageweav.com'
    },
    {
      id: '2',
      name: 'John Angami',
      businessName: 'Organic Valley Farms',
      email: 'john@organicvalley.com',
      phone: '+91 98765 43211',
      address: 'Kohima Village',
      district: 'Kohima',
      category: 'Agriculture & Food',
      specializations: ['Organic Vegetables', 'Herbs', 'Honey'],
      productsCount: 28,
      rating: 4.6,
      registrationDate: '2023-04-20',
      status: 'active',
      certifications: ['Organic Certification', 'FSSAI'],
      monthlyRevenue: 65000,
      description: 'Sustainable farming practices with focus on organic produce.'
    },
    {
      id: '3',
      name: 'Sarah Ao',
      businessName: 'Bamboo Craft Co.',
      email: 'sarah@bamboocraft.com',
      phone: '+91 98765 43212',
      address: 'Mokokchung Town',
      district: 'Mokokchung',
      category: 'Bamboo & Wood Crafts',
      specializations: ['Bamboo Furniture', 'Baskets', 'Home Decor'],
      productsCount: 32,
      rating: 4.5,
      registrationDate: '2023-08-10',
      status: 'active',
      certifications: ['Forest Stewardship Council'],
      monthlyRevenue: 45000,
      description: 'Eco-friendly bamboo products with traditional craftsmanship.'
    }
  ]);

  const [newProducer, setNewProducer] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    category: '',
    specializations: '',
    description: '',
    website: ''
  });

  const categories = [
    'Textiles & Handicrafts',
    'Agriculture & Food',
    'Bamboo & Wood Crafts',
    'Pottery & Ceramics',
    'Jewelry & Accessories',
    'Traditional Medicine',
    'Art & Paintings'
  ];

  const districts = [
    'Kohima', 'Dimapur', 'Mokokchung', 'Mon', 'Tuensang', 
    'Zunheboto', 'Wokha', 'Phek', 'Kiphire', 'Longleng', 'Peren'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredProducers = producers.filter(producer => {
    const matchesSearch = producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || producer.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || producer.district === selectedDistrict;
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const handleAddProducer = () => {
    if (!newProducer.name || !newProducer.businessName || !newProducer.email || !newProducer.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const producer: Producer = {
      id: Date.now().toString(),
      ...newProducer,
      specializations: newProducer.specializations.split(',').map(s => s.trim()).filter(s => s),
      productsCount: 0,
      rating: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      certifications: [],
      monthlyRevenue: 0
    };

    setProducers(prev => [...prev, producer]);
    setNewProducer({ 
      name: '', businessName: '', email: '', phone: '', address: '', 
      district: '', category: '', specializations: '', description: '', website: '' 
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Producer added successfully"
    });
  };

  const handleViewProducer = (producer: Producer) => {
    setSelectedProducer(producer);
    setIsViewDialogOpen(true);
  };

  const stats = {
    total: producers.length,
    active: producers.filter(p => p.status === 'active').length,
    pending: producers.filter(p => p.status === 'pending').length,
    avgRating: producers.reduce((acc, p) => acc + p.rating, 0) / producers.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Producer Management</h2>
          <p className="text-muted-foreground">Manage local producers and their business profiles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Producer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Producer</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Producer Name *</Label>
                <Input
                  id="name"
                  value={newProducer.name}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter producer name"
                />
              </div>
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={newProducer.businessName}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newProducer.email}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newProducer.phone}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Select 
                  value={newProducer.district} 
                  onValueChange={(value) => setNewProducer(prev => ({ ...prev, district: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={newProducer.category} 
                  onValueChange={(value) => setNewProducer(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newProducer.address}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                <Input
                  id="specializations"
                  value={newProducer.specializations}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, specializations: e.target.value }))}
                  placeholder="e.g., Traditional Weaving, Shawls, Bags"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="website">Website (optional)</Label>
                <Input
                  id="website"
                  value={newProducer.website}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProducer.description}
                  onChange={(e) => setNewProducer(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the producer and their work"
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={handleAddProducer} className="flex-1">Add Producer</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Producers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search producers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Producers List */}
      <div className="grid gap-4">
        {filteredProducers.map((producer) => (
          <Card key={producer.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{producer.name}</h3>
                    <Badge className={getStatusColor(producer.status)}>
                      {producer.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-blue-600">{producer.businessName}</p>
                  <p className="text-sm text-muted-foreground mb-2">{producer.category}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {producer.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {producer.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {producer.district}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProducer(producer)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{producer.productsCount} Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{producer.rating}/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">₹{(producer.monthlyRevenue / 1000).toFixed(0)}K/month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">{producer.certifications.length} Certifications</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-1">
                  {producer.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {producer.description && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">{producer.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Producer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Producer Details</DialogTitle>
          </DialogHeader>
          {selectedProducer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Producer Name</Label>
                  <p className="font-medium">{selectedProducer.name}</p>
                </div>
                <div>
                  <Label>Business Name</Label>
                  <p className="font-medium">{selectedProducer.businessName}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p>{selectedProducer.category}</p>
                </div>
                <div>
                  <Label>District</Label>
                  <p>{selectedProducer.district}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedProducer.rating}/5</span>
                  </div>
                </div>
                <div>
                  <Label>Monthly Revenue</Label>
                  <p>₹{selectedProducer.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <Label>Specializations</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedProducer.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedProducer.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline">{cert}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{selectedProducer.description}</p>
              </div>
              
              {selectedProducer.website && (
                <div>
                  <Label>Website</Label>
                  <a href={selectedProducer.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline text-sm">
                    {selectedProducer.website}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
