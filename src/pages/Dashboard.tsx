
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
  LogOut,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const upcomingEvents = [
  { title: 'Digital Marketing Batch Graduation', date: '2024-01-15', type: 'graduation', priority: 'high' },
  { title: 'Job Fair - Tech Companies', date: '2024-01-18', type: 'job-fair', priority: 'medium' },
  { title: 'Startup Pitch Competition', date: '2024-01-22', type: 'competition', priority: 'high' },
  { title: 'Quarterly Review Meeting', date: '2024-01-25', type: 'meeting', priority: 'low' },
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
            <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 animate-pulse text-blue-400" />
              Loading system data...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 glass-effect rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Dashboard Control Center
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-400" />
            Welcome back, <span className="text-blue-400 font-medium">{profile?.full_name || 'User'}</span> 
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {profile?.role}
            </span>
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={signOut} 
          className="flex items-center gap-2 hover-glow rounded-xl border-white/20 hover:border-red-500/50"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className="slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Performance */}
        <Card className="futuristic-card slide-in-from-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              Department Performance
              <div className="ml-auto">
                <Cpu className="h-4 w-4 text-green-400 animate-pulse" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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

        {/* Placement Distribution */}
        <Card className="futuristic-card slide-in-from-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <Briefcase className="h-6 w-6 text-purple-400" />
              Placement Distribution
              <div className="ml-auto">
                <Activity className="h-4 w-4 text-green-400 animate-pulse" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={placementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="value"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                >
                  {placementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {placementData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg glass-effect">
                  <div 
                    className="w-4 h-4 rounded-full neon-glow-blue" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
            </div>
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
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.priority === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {event.priority}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="futuristic-card slide-in-from-right">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gradient">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Add New Student', desc: 'Register new participant', color: 'blue' },
                { title: 'Schedule Training', desc: 'Create new batch', color: 'purple' },
                { title: 'Post Job Opening', desc: 'Add new opportunity', color: 'green' },
                { title: 'Generate Report', desc: 'Export monthly data', color: 'orange' },
              ].map((action, index) => (
                <button 
                  key={index}
                  className="w-full p-4 text-left rounded-xl glass-effect hover-lift group transition-all duration-300"
                >
                  <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {action.desc}
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
