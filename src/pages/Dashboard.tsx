
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building2,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  { title: 'Digital Marketing Batch Graduation', date: '2024-01-15', type: 'graduation' },
  { title: 'Job Fair - Tech Companies', date: '2024-01-18', type: 'job-fair' },
  { title: 'Startup Pitch Competition', date: '2024-01-22', type: 'competition' },
  { title: 'Quarterly Review Meeting', date: '2024-01-25', type: 'meeting' },
];

export const Dashboard = () => {
  const { 
    studentsCount, 
    trainersCount, 
    jobPlacements, 
    incubationProjects, 
    departmentData, 
    placementData, 
    loading 
  } = useDashboardData();
  
  const { signOut, profile } = useAuth();

  const stats = [
    { title: 'Total Students', value: studentsCount.toString(), change: '+12% from last month', changeType: 'positive' as const, icon: Users },
    { title: 'Active Trainers', value: trainersCount.toString(), change: '+3 new this week', changeType: 'positive' as const, icon: GraduationCap },
    { title: 'Job Placements', value: jobPlacements.toString(), change: '+8% this quarter', changeType: 'positive' as const, icon: Briefcase },
    { title: 'Incubation Projects', value: incubationProjects.toString(), change: '5 new startups', changeType: 'positive' as const, icon: Building2 },
  ];

  if (loading) {
    return (
      <div className="space-y-6 fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-accent/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'User'}! ({profile?.role})
          </p>
        </div>
        <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className="slide-in-from-left" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card className="slide-in-from-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="students" fill="#ffffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Placement Distribution */}
        <Card className="slide-in-from-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Placement by Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={placementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {placementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {placementData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2 slide-in-from-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                  <div className="flex-shrink-0">
                    {event.type === 'graduation' && <GraduationCap className="h-5 w-5 text-green-500" />}
                    {event.type === 'job-fair' && <Briefcase className="h-5 w-5 text-blue-500" />}
                    {event.type === 'competition' && <TrendingUp className="h-5 w-5 text-purple-500" />}
                    {event.type === 'meeting' && <Users className="h-5 w-5 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="slide-in-from-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">Add New Student</div>
                <div className="text-sm text-muted-foreground">Register new participant</div>
              </button>
              <button className="w-full p-3 text-left rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">Schedule Training</div>
                <div className="text-sm text-muted-foreground">Create new batch</div>
              </button>
              <button className="w-full p-3 text-left rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">Post Job Opening</div>
                <div className="text-sm text-muted-foreground">Add new opportunity</div>
              </button>
              <button className="w-full p-3 text-left rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-muted-foreground">Export monthly data</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
