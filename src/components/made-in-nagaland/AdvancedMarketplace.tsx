import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ShoppingBag, 
  TrendingUp, 
  Star, 
  Eye, 
  Heart,
  Share2,
  Filter,
  Search,
  MapPin,
  Award,
  DollarSign,
  Users,
  Package,
  Calendar,
  BarChart3,
  Camera
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const AdvancedMarketplace = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [marketplaceStats] = useState({
    totalProducts: 486,
    activeVendors: 127,
    totalSales: 2456789,
    avgRating: 4.6,
    monthlyGrowth: 18.5,
    featuredProducts: 32
  });

  const [featuredProducts] = useState([
    {
      id: 1,
      name: 'Traditional Naga Shawl',
      producer: 'Kohima Weavers Collective',
      price: 2500,
      originalPrice: 3000,
      rating: 4.8,
      reviews: 127,
      image: '/api/placeholder/200/200',
      category: 'Handicrafts',
      status: 'featured',
      views: 1542,
      likes: 89,
      inStock: true,
      stockCount: 15,
      tags: ['traditional', 'handmade', 'authentic'],
      description: 'Authentic Naga tribal shawl handwoven with traditional patterns',
      certifications: ['Handmade', 'Fair Trade', 'Authentic']
    },
    {
      id: 2,
      name: 'Organic Naga King Chili Sauce',
      producer: 'Dimapur Spice Co.',
      price: 350,
      originalPrice: 400,
      rating: 4.9,
      reviews: 203,
      image: '/api/placeholder/200/200',
      category: 'Food & Spices',
      status: 'bestseller',
      views: 2341,
      likes: 156,
      inStock: true,
      stockCount: 87,
      tags: ['organic', 'spicy', 'local'],
      description: 'Premium organic sauce made from authentic Naga king chilies',
      certifications: ['Organic', 'Locally Sourced', 'Authentic']
    }
  ]);

  const [vendors] = useState([
    {
      id: 1,
      name: 'Kohima Artisan Hub',
      location: 'Kohima, Nagaland',
      products: 24,
      rating: 4.7,
      totalSales: 156780,
      joinDate: '2023-03-15',
      verified: true,
      specialties: ['Handicrafts', 'Textiles', 'Pottery'],
      description: 'Traditional artisan collective preserving Naga heritage'
    },
    {
      id: 2,
      name: 'Dimapur Organic Farms',
      location: 'Dimapur, Nagaland',
      products: 18,
      rating: 4.8,
      totalSales: 234567,
      joinDate: '2023-01-20',
      verified: true,
      specialties: ['Organic Food', 'Spices', 'Honey'],
      description: 'Certified organic farm producing authentic Naga ingredients'
    }
  ]);

  const [analytics] = useState({
    topCategories: [
      { name: 'Handicrafts', sales: 45, growth: 12 },
      { name: 'Food & Spices', sales: 32, growth: 18 },
      { name: 'Textiles', sales: 28, growth: 8 },
      { name: 'Jewelry', sales: 22, growth: 15 }
    ],
    salesTrend: [
      { month: 'Jan', sales: 125000 },
      { month: 'Feb', sales: 142000 },
      { month: 'Mar', sales: 158000 },
      { month: 'Apr', sales: 176000 },
      { month: 'May', sales: 195000 },
      { month: 'Jun', sales: 218000 }
    ],
    customerMetrics: {
      newCustomers: 156,
      returningCustomers: 312,
      averageOrderValue: 1250,
      customerSatisfaction: 4.6
    }
  });

  const categories = ['All', 'Handicrafts', 'Food & Spices', 'Textiles', 'Jewelry', 'Pottery', 'Art'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Made in Nagaland Marketplace</h2>
          <p className="text-muted-foreground">Advanced e-commerce platform for authentic Naga products</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            AR Preview
          </Button>
          <Button className="professional-button">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Sell Products
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold">{marketplaceStats.totalProducts}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-3xl font-bold text-green-400">{marketplaceStats.activeVendors}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-3xl font-bold text-purple-400">₹{(marketplaceStats.totalSales / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-400">{marketplaceStats.avgRating}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Growth</p>
                <p className="text-3xl font-bold text-emerald-400">+{marketplaceStats.monthlyGrowth}%</p>
              </div>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-3xl font-bold text-orange-400">{marketplaceStats.featuredProducts}</p>
              </div>
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Award className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.toLowerCase())}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Products Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="glass-card group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={product.status === 'featured' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}>
                        {product.status}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.producer}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {product.views}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {product.stockCount} in stock
                      </span>
                      <div className="flex gap-1">
                        {product.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">Add to Cart</Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Verified Vendors</CardTitle>
              <CardDescription>Authentic producers and artisans from Nagaland</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="p-6 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{vendor.name}</h3>
                          {vendor.verified && (
                            <Badge className="bg-blue-500/20 text-blue-300">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {vendor.location}
                        </div>
                        
                        <p className="text-muted-foreground max-w-2xl">{vendor.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {vendor.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Products:</span>
                            <div className="font-semibold">{vendor.products}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Rating:</span>
                            <div className="font-semibold flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              {vendor.rating}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Sales:</span>
                            <div className="font-semibold">₹{vendor.totalSales.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Member Since:</span>
                            <div className="font-semibold">{vendor.joinDate}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline">View Products</Button>
                        <Button variant="outline">Contact</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{category.sales}%</div>
                        <div className="text-xs text-green-400">+{category.growth}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>New Customers</span>
                      <span className="font-semibold">{analytics.customerMetrics.newCustomers}</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Returning Customers</span>
                      <span className="font-semibold">{analytics.customerMetrics.returningCustomers}</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold">₹{analytics.customerMetrics.averageOrderValue}</div>
                      <div className="text-sm text-muted-foreground">Avg Order Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{analytics.customerMetrics.customerSatisfaction}</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage product listings and inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Bulk Import Products</Button>
                <Button className="w-full" variant="outline">Update Inventory</Button>
                <Button className="w-full" variant="outline">Price Management</Button>
                <Button className="w-full" variant="outline">Quality Control</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Vendor Operations</CardTitle>
                <CardDescription>Manage vendor relationships and onboarding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Vendor Applications</Button>
                <Button className="w-full" variant="outline">Training Programs</Button>
                <Button className="w-full" variant="outline">Performance Reviews</Button>
                <Button className="w-full" variant="outline">Support Center</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};