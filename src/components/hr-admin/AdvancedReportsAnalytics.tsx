
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/utils/supabaseHelpers';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  PieChart,
  LineChart,
  FileText,
  Users,
  DollarSign,
  Clock,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface ReportData {
  id: string;
  name: string;
  type: 'payroll' | 'performance' | 'attendance' | 'recruitment';
  generated_at: string;
  status: 'generating' | 'completed' | 'failed';
  data: any;
}

export function AdvancedReportsAnalytics() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [reportFilters, setReportFilters] = useState({
    dateRange: '30days',
    department: 'all',
    reportType: 'all'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock analytics data
  const mockAnalytics = {
    overview: {
      totalEmployees: 247,
      avgSalary: 85000,
      totalPayroll: 20995000,
      performanceScore: 4.2,
      attendanceRate: 94.5,
      turnoverRate: 8.2
    },
    departmentData: [
      { name: 'Engineering', employees: 85, avgSalary: 95000, performance: 4.3 },
      { name: 'Sales', employees: 62, avgSalary: 78000, performance: 4.1 },
      { name: 'Marketing', employees: 38, avgSalary: 72000, performance: 4.0 },
      { name: 'HR', employees: 25, avgSalary: 68000, performance: 4.2 },
      { name: 'Finance', employees: 37, avgSalary: 82000, performance: 4.4 }
    ],
    salaryTrends: [
      { month: 'Jan', amount: 20200000 },
      { month: 'Feb', amount: 20350000 },
      { month: 'Mar', amount: 20500000 },
      { month: 'Apr', amount: 20650000 },
      { month: 'May', amount: 20800000 },
      { month: 'Jun', amount: 20995000 }
    ],
    performanceTrends: [
      { month: 'Jan', score: 4.0 },
      { month: 'Feb', score: 4.1 },
      { month: 'Mar', score: 4.0 },
      { month: 'Apr', score: 4.2 },
      { month: 'May', score: 4.3 },
      { month: 'Jun', score: 4.2 }
    ]
  };

  const { data: reports } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const { data, error } = await supabaseHelpers.students.select('*');
        // Mock report data since we don't have a reports table
        return [
          {
            id: '1',
            name: 'Monthly Payroll Report',
            type: 'payroll',
            generated_at: '2024-03-15T10:00:00Z',
            status: 'completed',
            data: mockAnalytics
          },
          {
            id: '2',
            name: 'Performance Analysis Q1',
            type: 'performance',
            generated_at: '2024-03-20T14:30:00Z',
            status: 'completed',
            data: mockAnalytics
          },
          {
            id: '3',
            name: 'Attendance Summary',
            type: 'attendance',
            generated_at: '2024-03-25T09:15:00Z',
            status: 'generating',
            data: null
          }
        ] as ReportData[];
      } catch (error) {
        return [] as ReportData[];
      }
    }
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics', reportFilters],
    queryFn: async () => mockAnalytics
  });

  const generateReportMutation = useMutation({
    mutationFn: async (reportConfig: { name: string; type: string; filters: any }) => {
      // Simulate report generation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            ...reportConfig,
            generated_at: new Date().toISOString(),
            status: 'completed',
            data: mockAnalytics
          });
        }, 2000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast({ title: 'Report generated successfully' });
    }
  });

  const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    toast({ title: `Exporting report as ${format.toUpperCase()}...` });
    // Mock export functionality
    setTimeout(() => {
      toast({ title: `Report exported successfully as ${format.toUpperCase()}` });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button onClick={() => generateReportMutation.mutate({
            name: 'Custom Report',
            type: 'performance',
            filters: reportFilters
          })}>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {/* KPI Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics?.overview.totalEmployees}</p>
                    <p className="text-sm text-gray-600">Total Employees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">${analytics?.overview.avgSalary.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Avg Salary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Award className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics?.overview.performanceScore}</p>
                    <p className="text-sm text-gray-600">Performance Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics?.overview.attendanceRate}%</p>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{analytics?.overview.turnoverRate}%</p>
                    <p className="text-sm text-gray-600">Turnover Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="text-2xl font-bold">${(analytics?.overview.totalPayroll / 1000000).toFixed(1)}M</p>
                    <p className="text-sm text-gray-600">Total Payroll</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Average performance scores by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="performance" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Salary Distribution by Department</CardTitle>
                <CardDescription>Average salary by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analytics?.departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="avgSalary"
                    >
                      {analytics?.departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg Salary']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Trends</CardTitle>
                <CardDescription>Monthly payroll expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics?.salaryTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
                    <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Average performance scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={analytics?.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 4.5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={3} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Reports
              </CardTitle>
              <CardDescription>
                View and manage previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports?.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-gray-600">
                          Type: {report.type} • Generated: {new Date(report.generated_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        {report.status === 'completed' && (
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportReport(report.id, 'pdf')}
                            >
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportReport(report.id, 'excel')}
                            >
                              Excel
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportReport(report.id, 'csv')}
                            >
                              CSV
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Reports
              </CardTitle>
              <CardDescription>
                Manage automated report generation schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No scheduled reports configured</p>
                <Button className="mt-4">
                  Create Scheduled Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>
                Build custom reports with advanced filtering and grouping options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payroll">Payroll Analysis</SelectItem>
                        <SelectItem value="performance">Performance Review</SelectItem>
                        <SelectItem value="attendance">Attendance Report</SelectItem>
                        <SelectItem value="recruitment">Recruitment Metrics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Date Range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="3months">Last 3 months</SelectItem>
                        <SelectItem value="1year">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Report Name</Label>
                  <Input placeholder="Enter report name..." />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => generateReportMutation.mutate({
                    name: 'Custom Report',
                    type: 'custom',
                    filters: reportFilters
                  })}>
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
