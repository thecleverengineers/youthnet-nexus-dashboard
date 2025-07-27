
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';

export const MarketplaceAnalytics = () => {
  const { data: marketplaceMetrics } = useQuery({
    queryKey: ['marketplace-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketplace_metrics')
        .select('*')
        .order('metric_date', { ascending: false })
        .limit(30);

      if (error) throw error;
      return data || [];
    }
  });

  const { data: productSales } = useQuery({
    queryKey: ['product-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_sales')
        .select('*')
        .order('sale_date', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    }
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  // Calculate summary stats
  const totalSales = marketplaceMetrics?.reduce((sum, m) => sum + (m.total_sales || 0), 0) || 0;
  const totalOrders = marketplaceMetrics?.reduce((sum, m) => sum + (m.total_orders || 0), 0) || 0;
  const uniqueBuyers = marketplaceMetrics?.reduce((sum, m) => Math.max(sum, m.unique_buyers || 0), 0) || 0;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Prepare chart data
  const salesTrendData = marketplaceMetrics?.slice(0, 7).reverse().map(metric => ({
    date: new Date(metric.metric_date).toLocaleDateString(),
    sales: metric.total_sales,
    orders: metric.total_orders
  })) || [];

  const { data: categoryData = [] } = useQuery({
    queryKey: ['marketplace-category-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');

      if (error) throw error;

      const categoryCounts = (data || []).reduce((acc: Record<string, number>, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categoryCounts).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));
    }
  });

  const revenueByRegion = marketplaceMetrics?.[0]?.revenue_by_region || {};
  const regionData = Object.entries(revenueByRegion).map(([region, revenue]) => ({
    region,
    revenue: revenue as number
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-3xl font-bold text-primary">₹{totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Buyers</p>
                <p className="text-3xl font-bold text-green-600">{uniqueBuyers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-3xl font-bold text-orange-600">₹{avgOrderValue.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily sales and order trends</CardDescription>
          </CardHeader>
          <CardContent>
            {salesTrendData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No sales data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Popular product categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No category data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Region */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Region</CardTitle>
            <CardDescription>Geographic distribution of sales</CardDescription>
          </CardHeader>
          <CardContent>
            {regionData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No regional data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales Activity</CardTitle>
            <CardDescription>Latest product sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {!productSales || productSales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No recent sales data</div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {productSales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{sale.customer_name || 'Anonymous Customer'}</div>
                      <div className="text-sm text-muted-foreground">
                        {sale.quantity_sold} items • {sale.sale_channel || 'Online'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{sale.total_amount}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
