
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GraduationCap, Briefcase, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ConnectionStatus } from '@/components/common/ConnectionStatus';

// Mock data fallback when API is not available
const mockDashboardData = {
  totalStudents: 156,
  activePrograms: 12,
  jobPlacements: 34,
  completionRate: 78,
  recentActivities: [
    { id: 1, type: 'enrollment', description: 'New student enrolled in Web Development', timestamp: '2 hours ago' },
    { id: 2, type: 'completion', description: 'Digital Marketing program completed by 5 students', timestamp: '4 hours ago' },
    { id: 3, type: 'placement', description: 'Student placed at Tech Startup', timestamp: '1 day ago' }
  ],
  upcomingEvents: [
    { id: 1, title: 'Career Fair 2024', date: '2024-01-15', type: 'event' },
    { id: 2, title: 'Web Development Bootcamp', date: '2024-01-20', type: 'program' }
  ]
};

export default function Dashboard() {
  const { 
    data: dashboardData, 
    isLoading, 
    error, 
    refetch,
    isError 
  } = useQuery({
    queryKey: ['dashboard', '30d'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/dashboard?period=30d');
        return response;
      } catch (error: any) {
        console.error('Dashboard API error:', error);
        // Return mock data when API fails
        return mockDashboardData;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const data = dashboardData || mockDashboardData;
  const isUsingMockData = !dashboardData || isError;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">YouthNet Dashboard</h1>
          <span className="text-gray-600 mt-2">
            Welcome to your comprehensive management portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ConnectionStatus showDetails={true} />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isUsingMockData && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Backend connection unavailable. Showing sample data for demonstration.
            Please ensure the YouthNet API server is running on port 5000.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents}</div>
            <span className="text-xs text-muted-foreground">Active enrollments</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activePrograms}</div>
            <span className="text-xs text-muted-foreground">Currently running</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Placements</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.jobPlacements}</div>
            <span className="text-xs text-muted-foreground">This month</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completionRate}%</div>
            <span className="text-xs text-muted-foreground">Program success rate</span>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and connectivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Frontend Application</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backend API</span>
                  <Badge variant={isUsingMockData ? "destructive" : "default"}>
                    {isUsingMockData ? "Offline" : "Online"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <Badge variant={isUsingMockData ? "secondary" : "default"}>
                    {isUsingMockData ? "Unknown" : "Connected"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Add New Student
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create Training Program
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivities?.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{activity.description}</span>
                      <div className="text-sm text-muted-foreground">{activity.timestamp}</div>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled events and program milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.upcomingEvents?.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">{event.date}</div>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
