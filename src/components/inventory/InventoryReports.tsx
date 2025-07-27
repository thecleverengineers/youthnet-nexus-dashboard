import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const InventoryReports = () => {
  const [reportType, setReportType] = useState('overview');

  const { data: categoryData = [] } = useQuery({
    queryKey: ['inventory-category-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('category')
        .order('category');

      if (error) throw error;

      const categoryCounts = (data || []).reduce((acc: Record<string, number>, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        value: Math.round((count / data.length) * 100),
        count
      }));
    }
  });

  const { data: monthlyData = [] } = useQuery({
    queryKey: ['inventory-monthly-data'],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data, error } = await supabase
        .from('inventory_items')
        .select('created_at, purchase_date')
        .gte('created_at', sixMonthsAgo.toISOString());

      if (error) throw error;

      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const purchases = (data || []).filter(item => {
          const createdAt = new Date(item.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length;

        months.push({
          month: monthKey,
          purchases,
          disposals: Math.floor(purchases * 0.1) // Estimate disposals as 10% of purchases
        });
      }

      return months;
    }
  });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  const { data: reports = [] } = useQuery({
    queryKey: ['inventory-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('type', 'inventory')
        .order('generated_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Inventory Reports & Analytics
            </div>
            <div className="flex gap-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="category">Category Analysis</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
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
            </div>

            {/* Monthly Trends */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="purchases" fill="hsl(var(--primary))" name="Purchases" />
                  <Bar dataKey="disposals" fill="hsl(var(--secondary))" name="Disposals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="text-sm font-medium text-muted-foreground">Total Items</h4>
              <p className="text-2xl font-bold">{categoryData.reduce((sum, cat) => sum + cat.count, 0)}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
              <p className="text-2xl font-bold">{categoryData.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="text-sm font-medium text-muted-foreground">This Month</h4>
              <p className="text-2xl font-bold">{monthlyData[monthlyData.length - 1]?.purchases || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="text-sm font-medium text-muted-foreground">Utilization</h4>
              <p className="text-2xl font-bold">85%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Generated on {new Date(report.generated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No reports generated yet. Generate your first inventory report to see it here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};