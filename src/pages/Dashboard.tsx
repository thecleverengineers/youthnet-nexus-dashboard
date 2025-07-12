import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading-spinner';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Settings,
  LogOut,
  Zap,
  Activity,
  Cpu,
  Building2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useDashboardData } from '@/hooks/useDashboardData';

interface DashboardStats {
  totalUsers: number;
  activeStudents: number;
  totalCourses: number;
  completionRate: number;
  jobPlacements: number;
  monthlyRevenue: number;
  pendingApplications: number;
  systemHealth: number;
}

interface ChartData {
  month: string;
  enrollments: number;
  completions: number;
  placements: number;
  revenue: number;
}

interface ActivityData {
  id: string;
  type: 'enrollment' | 'completion' | 'placement' | 'system';
  message: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const upcomingEvents = [
  { title: 'Digital Marketing Batch Graduation', date: '2024-01-15', type: 'graduation', priority: 'high' },
  { title: 'Job Fair - Tech Companies', date: '2024-01-18', type: 'job-fair', priority: 'medium' },
  { title: 'Startup Pitch Competition', date: '2024-01-22', type: 'competition', priority: 'high' },
  { title: 'Quarterly Review Meeting', date: '2024-01-25', type: 'meeting', priority: 'low' },
];

export const Dashboard = () => {
  const { user, signOut, profile } = useUnifiedAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    studentsCount, 
    trainersCount, 
    jobPlacements, 
    incubationProjects, 
    departmentData, 
    placementData, 
    loading: dashboardLoading 
  } = useDashboardData();

  // Enhanced fetch dashboard data with fallback to hook data
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard', selectedPeriod],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{
          stats: DashboardStats;
          chartData: ChartData[];
          activities: ActivityData[];
        }>(`/dashboard?period=${selectedPeriod}`);
        return response.data;
      } catch (error) {
        // Fallback to mock data if API is not available
        return {
          stats: {
            totalUsers: 1250,
            activeStudents: studentsCount || 987,
            totalCourses: 45,
            completionRate: 78.5,
            jobPlacements: jobPlacements || 342,
            monthlyRevenue: 125000,
            pendingApplications: 23,
            systemHealth: 98.5,
          },
          chartData: [
            { month: 'Jan', enrollments: 120, completions: 95, placements: 42, revenue: 85000 },
            { month: 'Feb', enrollments: 135, completions: 108, placements: 38, revenue: 92000 },
            { month: 'Mar', enrollments: 158, completions: 124, placements: 55, revenue: 108000 },
            { month: 'Apr', enrollments: 142, completions: 118, placements: 48, revenue: 98000 },
            { month: 'May', enrollments: 165, completions: 132, placements: 62, revenue: 125000 },
            { month: 'Jun', enrollments: 180, completions: 145, placements: 58, revenue: 135000 },
          ],
          activities: [
            {
              id: '1',
              type: 'enrollment' as const,
              message: 'New student enrolled in Web Development course',
              timestamp: '2 minutes ago',
              priority: 'low' as const,
            },
            {
              id: '2',
              type: 'completion' as const,
              message: 'John Doe completed Digital Marketing certification',
              timestamp: '15 minutes ago',
              priority: 'medium' as const,
            },
            {
              id: '3',
              type: 'placement' as const,
              message: 'Sarah Smith placed at TechCorp as Frontend Developer',
              timestamp: '1 hour ago',
              priority: 'high' as const,
            },
            {
              id: '4',
              type: 'system' as const,
              message: 'Monthly backup completed successfully',
              timestamp: '2 hours ago',
              priority: 'low' as const,
            },
          ],
        };
      }
    },
    refetchInterval: 60000, // Refresh every minute
    retry: 1,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast({
      title: 'Dashboard Updated',
      description: 'Latest data has been loaded successfully.',
    });
  };

  const stats = dashboardData?.stats || {
    totalUsers: 1250,
    activeStudents: studentsCount || 987,
    totalCourses: 45,
    completionRate: 78.5,
    jobPlacements: jobPlacements || 342,
    monthlyRevenue: 125000,
    pendingApplications: 23,
    systemHealth: 98.5,
  };

  const chartData = dashboardData?.chartData || [];
  const activities = dashboardData?.activities || [];

  const pieData = [
    { name: 'Completed', value: stats.completionRate, color: '#10B981' },
    { name: 'In Progress', value: 100 - stats.completionRate, color: '#F59E0B' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="h-4 w-4 text-blue-500" />;
      case 'completion': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'placement': return <Briefcase className="h-4 w-4 text-purple-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/30';
    }
  };

  if (isLoading || dashboardLoading) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient">Dashboard Control Center</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 animate-pulse text-blue-400" />
              Loading system data...
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-effect animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Dashboard Control Center
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            Welcome back, <span className="text-blue-400 font-medium">{(user as any)?.fullName || (user as any)?.profile?.fullName || 'Admin'}</span>
            <Badge variant="outline" className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
              {(user as any)?.role || (user as any)?.profile?.role || 'Admin'}
            </Badge>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={selectedPeriod === '7d' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setSelectedPeriod('7d')}
          >
            7 Days
          </Button>
          <Button 
            variant={selectedPeriod === '30d' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setSelectedPeriod('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={selectedPeriod === '90d' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setSelectedPeriod('90d')}
          >
            90 Days
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={signOut} 
            className="flex items-center gap-2 hover:border-red-500/50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="futuristic-card hover:shadow-lg transition-all duration-300 slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.activeStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Placements</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.jobPlacements}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-400">+23%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover:shadow-lg transition-all duration-300 slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient">{stats.systemHealth}%</div>
            <Progress value={stats.systemHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Department Performance */}
        <Card className="lg:col-span-2 futuristic-card slide-in-from-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              Department Performance
              <div className="ml-auto">
                <Cpu className="h-4 w-4 text-green-400 animate-pulse" />
              </div>
            </CardTitle>
            <CardDescription>Performance metrics across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.6)" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }} 
                />
                <Bar 
                  dataKey="students" 
                  fill="url(#blueGradient)" 
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="futuristic-card slide-in-from-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <Target className="h-6 w-6 text-emerald-400" />
              Completion Rate
              <div className="ml-auto">
                <Activity className="h-4 w-4 text-green-400 animate-pulse" />
              </div>
            </CardTitle>
            <CardDescription>Course completion statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                  dataKey="value"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2 futuristic-card slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <Calendar className="h-6 w-6 text-cyan-400" />
              Mission Control - Upcoming Events
            </CardTitle>
            <CardDescription>Key events and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl glass-effect hover-lift group">
                  <div className="flex-shrink-0">
                    {event.type === 'graduation' && <GraduationCap className="h-6 w-6 text-green-400" />}
                    {event.type === 'job-fair' && <Briefcase className="h-6 w-6 text-blue-400" />}
                    {event.type === 'competition' && <TrendingUp className="h-6 w-6 text-purple-400" />}
                    {event.type === 'meeting' && <Users className="h-6 w-6 text-orange-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(event.priority)}>
                    {event.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="futuristic-card slide-in-from-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <Activity className="h-6 w-6 text-orange-400" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>Real-time system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg glass-effect hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className={getPriorityColor(activity.priority)}>
                    {activity.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};