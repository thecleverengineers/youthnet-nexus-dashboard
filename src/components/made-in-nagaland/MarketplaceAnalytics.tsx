
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Eye,
  ShoppingCart,
  Star,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
  products: number;
}

interface CategoryPerformance {
  category: string;
  revenue: number;
  growth: number;
  orders: number;
  avgPrice: number;
}

interface TopProduct {
  id: string;
  name: string;
  producer: string;
  category: string;
  revenue: number;
  units: number;
  rating: number;
  views: number;
}

export const MarketplaceAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const salesData: SalesData[] = [
    { month: 'Jan', revenue: 125000, orders: 89, customers: 67, products: 234 },
    { month: 'Feb', revenue: 142000, orders: 95, customers: 72, products: 245 },
    { month: 'Mar', revenue: 158000, orders: 108, customers: 84, products: 267 },
    { month: 'Apr', revenue: 167000, orders: 112, customers: 88, products: 278 },
    { month: 'May', revenue: 189000, orders: 125, customers: 95, products: 289 },
    { month: 'Jun', revenue: 203000, orders: 138, customers: 102, products: 298 }
  ];

  const categoryData: CategoryPerformance[] = [
    {
      category: 'Textiles & Handicrafts',
      revenue: 485000,
      growth: 15.2,
      orders: 342,
      avgPrice: 1418
    },
    {
      category: 'Agriculture & Food',
      revenue: 312000,
      growth: 8.7,
      orders: 256,
      avgPrice: 1219
    },
    {
      category: 'Bamboo & Wood Crafts',
      revenue: 198000,
      growth: 22.1,
      orders: 189,
      avgPrice: 1048
    },
    {
      category: 'Pottery & Ceramics',
      revenue: 156000,
      growth: 5.3,
      orders: 123,
      avgPrice: 1268
    },
    {
      category: 'Jewelry & Accessories',
      revenue: 234000,
      growth: 18.9,
      orders: 167,
      avgPrice: 1401
    }
  ];

  const topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Traditional Naga Shawl',
      producer: 'Heritage Weavers',
      category: 'Textiles',
      revenue: 85000,
      units: 42,
      rating: 4.8,
      views: 1234
    },
    {
      id: '2',
      name: 'Organic Wild Honey',
      producer: 'Organic Valley Farms',
      category: 'Food',
      revenue: 65000,
      units: 156,
      rating: 4.6,
      views: 987
    },
    {
      id: '3',
      name: 'Bamboo Furniture Set',
      producer: 'Bamboo Craft Co.',
      category: 'Furniture',
      revenue: 78000,
      units: 18,
      rating: 4.5,
      views: 756
    },
    {
      id: '4',
      name: 'Traditional Naga Necklace',
      producer: 'Heritage Jewelry',
      category: 'Jewelry',
      revenue: 45000,
      units: 28,
      rating: 4.7,
      views: 654
    }
  ];

  const trafficData = [
    { day: 'Mon', visitors: 2340, pageViews: 8900, conversions: 23 },
    { day: 'Tue', visitors: 2890, pageViews: 9450, conversions: 28 },
    { day: 'Wed', visitors: 3120, pageViews: 10200, conversions: 31 },
    { day: 'Thu', visitors: 2980, pageViews: 9800, conversions: 29 },
    { day: 'Fri', visitors: 3450, pageViews: 11200, conversions: 35 },
    { day: 'Sat', visitors: 4200, pageViews: 13400, conversions: 42 },
    { day: 'Sun', visitors: 3800, pageViews: 12100, conversions: 38 }
  ];

  const revenueDistribution = [
    { name: 'Online Sales', value: 65, color: '#3b82f6' },
    { name: 'Market Events', value: 25, color: '#10b981' },
    { name: 'Wholesale', value: 10, color: '#f59e0b' }
  ];

  const currentMonth = salesData[salesData.length - 1];
  const previousMonth = salesData[salesData.length - 2];
  
  const metrics = {
    totalRevenue: currentMonth.revenue,
    revenueGrowth: ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1),
    totalOrders: currentMonth.orders,
    orderGrowth: ((currentMonth.orders - previousMonth.orders) / previousMonth.orders * 100).toFixed(1),
    totalCustomers: currentMonth.customers,
    customerGrowth: ((currentMonth.customers - previousMonth.customers) / previousMonth.customers * 100).toFixed(1),
    totalProducts: currentMonth.products,
    productGrowth: ((currentMonth.products - previousMonth.products) / previousMonth.products * 100).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Marketplace Analytics</h2>
          <p className="text-muted-foreground">Comprehensive analysis of marketplace performance and trends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="textiles">Textiles & Handicrafts</SelectItem>
            <SelectItem value="food">Agriculture & Food</SelectItem>
            <SelectItem value="bamboo">Bamboo & Wood</SelectItem>
            <SelectItem value="jewelry">Jewelry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(metrics.totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600">+{metrics.revenueGrowth}% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
                <p className="text-xs text-blue-600">+{metrics.orderGrowth}% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{metrics.totalCustomers}</p>
                <p className="text-xs text-purple-600">+{metrics.customerGrowth}% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Listed Products</p>
                <p className="text-2xl font-bold">{metrics.totalProducts}</p>
                <p className="text-xs text-orange-600">+{metrics.productGrowth}% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and growth pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${(value as number / 1000).toFixed(0)}K`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>Revenue sources breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                      stroke="none"
                    >
                      {revenueDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {revenueDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders and Customers Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Orders & Customer Growth</CardTitle>
              <CardDescription>Track order volume and customer acquisition</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" name="Orders" />
                  <Line type="monotone" dataKey="customers" stroke="#f59e0b" name="Customers" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Revenue and growth by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'revenue') return [`₹${(value as number / 1000).toFixed(0)}K`, 'Revenue'];
                    return [value, name];
                  }} />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {categoryData.map((category) => (
              <Card key={category.category}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{category.category}</h3>
                    <Badge variant={category.growth > 10 ? 'default' : 'secondary'}>
                      {category.growth > 0 ? '+' : ''}{category.growth}% growth
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="text-xl font-bold">₹{(category.revenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="text-xl font-bold">{category.orders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Price</p>
                      <p className="text-xl font-bold">₹{category.avgPrice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4">
            {topProducts.map((product, index) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {product.producer} • {product.category}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-bold">₹{(product.revenue / 1000).toFixed(0)}K</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Units Sold</p>
                          <p className="font-bold">{product.units}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-bold">{product.views}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Price</p>
                          <p className="font-bold">₹{Math.round(product.revenue / product.units)}</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Daily visitors, page views, and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#3b82f6" name="Visitors" />
                  <Line type="monotone" dataKey="pageViews" stroke="#10b981" name="Page Views" />
                  <Line type="monotone" dataKey="conversions" stroke="#f59e0b" name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Weekly Visitors</p>
                    <p className="text-2xl font-bold">{trafficData.reduce((sum, day) => sum + day.visitors, 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                    <p className="text-2xl font-bold">{trafficData.reduce((sum, day) => sum + day.pageViews, 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                    <p className="text-2xl font-bold">{trafficData.reduce((sum, day) => sum + day.conversions, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
