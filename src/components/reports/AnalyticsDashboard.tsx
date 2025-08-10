
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, GraduationCap, Briefcase, Building2, DollarSign, Activity, Target, Clock } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedModule, setSelectedModule] = useState('all');

  // Mock analytics data
  const kpiData = [
    { title: 'Total Users', value: '2,459', change: '+12.5%', trend: 'up', icon: Users },
    { title: 'Active Students', value: '1,847', change: '+8.3%', trend: 'up', icon: GraduationCap },
    { title: 'Job Placements', value: '156', change: '+23.1%', trend: 'up', icon: Briefcase },
    { title: 'Revenue', value: '₹4.2L', change: '-2.4%', trend: 'down', icon: DollarSign },
  ];

  const userGrowthData = [
    { month: 'Jan', students: 1200, staff: 45, admins: 8 },
    { month: 'Feb', students: 1350, staff: 48, admins: 8 },
    { month: 'Mar', students: 1420, staff: 52, admins: 9 },
    { month: 'Apr', students: 1580, staff: 55, admins: 9 },
    { month: 'May', students: 1720, staff: 58, admins: 10 },
    { month: 'Jun', students: 1847, staff: 62, admins: 11 },
  ];

  const moduleUsageData = [
    { name: 'Education', value: 35, color: '#3b82f6' },
    { name: 'Skill Development', value: 28, color: '#8b5cf6' },
    { name: 'Job Centre', value: 18, color: '#06d6a0' },
    { name: 'HR Admin', value: 12, color: '#f59e0b' },
    { name: 'Other', value: 7, color: '#ef4444' },
  ];

  const performanceData = [
    { module: 'Education', performance: 94, students: 1200, completion: 87 },
    { module: 'Skill Development', performance: 89, students: 890, completion: 82 },
    { module: 'Job Centre', performance: 91, students: 560, completion: 75 },
    { module: 'Career Centre', performance: 86, students: 340, completion: 78 },
    { module: 'Incubation', performance: 88, students: 125, completion: 92 },
  ];

  const engagementData = [
    { time: '00:00', active: 12, peak: 45 },
    { time: '04:00', active: 8, peak: 45 },
    { time: '08:00', active: 156, peak: 45 },
    { time: '12:00', active: 298, peak: 45 },
    { time: '16:00', active: 234, peak: 45 },
    { time: '20:00', active: 89, peak: 45 },
  ];

  const getKpiIcon = (IconComponent: any, trend: string) => {
    return (
      <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <IconComponent className={`h-6 w-6 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
      </div>
    );
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive system analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 professional-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="last1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-40 professional-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="skills">Skill Development</SelectItem>
              <SelectItem value="jobs">Job Centre</SelectItem>
              <SelectItem value="hr">HR Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(kpi.trend)}
                    <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
                {getKpiIcon(kpi.icon, kpi.trend)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>User Growth Trend</CardTitle>
                <CardDescription>Monthly user registration and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="students" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="staff" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="admins" stackId="1" stroke="#06d6a0" fill="#06d6a0" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Module Usage Distribution</CardTitle>
                <CardDescription>Usage percentage across different modules</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={moduleUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moduleUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Performance Overview</CardTitle>
              <CardDescription>Real-time system metrics and health indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CPU Usage</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Memory Usage</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Storage Usage</span>
                    <span className="text-sm font-medium">34%</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Analytics Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>User Activity Heatmap</CardTitle>
                <CardDescription>User activity patterns throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={3} />
                    <Line type="monotone" dataKey="peak" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-blue-500/20 rounded-lg">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Daily Active Users</h3>
                  <p className="text-3xl font-bold text-blue-400">1,234</p>
                  <p className="text-sm text-muted-foreground mt-1">+5.3% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-purple-500/20 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Session Duration</h3>
                  <p className="text-3xl font-bold text-purple-400">24m</p>
                  <p className="text-sm text-muted-foreground mt-1">Average per session</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-500/20 rounded-lg">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Conversion Rate</h3>
                  <p className="text-3xl font-bold text-green-400">73%</p>
                  <p className="text-sm text-muted-foreground mt-1">Course completion</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Module Performance Metrics</CardTitle>
              <CardDescription>Performance indicators for each system module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((module, index) => (
                  <div key={index} className="p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{module.module}</h4>
                      <Badge variant="outline">{module.students} users</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Performance Score</span>
                          <span>{module.performance}%</span>
                        </div>
                        <Progress value={module.performance} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Completion Rate</span>
                          <span>{module.completion}%</span>
                        </div>
                        <Progress value={module.completion} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Feature Adoption</CardTitle>
                <CardDescription>Most and least used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { feature: 'Course Enrollment', usage: 89 },
                    { feature: 'Progress Tracking', usage: 76 },
                    { feature: 'Certificate Download', usage: 68 },
                    { feature: 'Job Applications', usage: 45 },
                    { feature: 'Skill Assessment', usage: 32 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.feature}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={item.usage} className="w-20 h-2" />
                        <span className="text-sm w-8">{item.usage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>User Satisfaction</CardTitle>
                <CardDescription>Feedback and rating metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">4.7</div>
                    <div className="text-sm text-muted-foreground">Overall Rating</div>
                    <div className="flex justify-center mt-2">
                      {'★'.repeat(5).split('').map((star, i) => (
                        <span key={i} className={`text-2xl ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`}>
                          {star}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positive Feedback</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Response Rate</span>
                      <span>64%</span>
                    </div>
                    <Progress value={64} className="h-2" />
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
