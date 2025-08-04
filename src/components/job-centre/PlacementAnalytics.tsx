
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function PlacementAnalytics() {
  const placementData = [
    { month: 'Jan', placements: 12, applications: 45 },
    { month: 'Feb', placements: 18, applications: 52 },
    { month: 'Mar', placements: 15, applications: 48 },
    { month: 'Apr', placements: 22, applications: 65 },
    { month: 'May', placements: 28, applications: 72 },
    { month: 'Jun', placements: 25, applications: 68 }
  ];

  const industryData = [
    { name: 'IT/Software', value: 35, color: '#8884d8' },
    { name: 'Banking/Finance', value: 25, color: '#82ca9d' },
    { name: 'Retail', value: 20, color: '#ffc658' },
    { name: 'Manufacturing', value: 15, color: '#ff7c7c' },
    { name: 'Others', value: 5, color: '#8dd1e1' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Placement Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Placement Trends</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="placements" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Placements"
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Industry Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
