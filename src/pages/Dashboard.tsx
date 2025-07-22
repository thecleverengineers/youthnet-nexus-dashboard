
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { AuthModal } from '@/components/auth/AuthModal';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building2,
  TrendingUp,
  Calendar,
  CheckCircle,
  Activity,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Dashboard = () => {
  const { 
    studentsCount, 
    trainersCount, 
    jobPlacements, 
    incubationProjects, 
    departmentData, 
    placementData
  } = useDashboardData();
  
  const { profile, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch real upcoming events from database
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Get training programs ending soon
      const { data: programs } = await supabase
        .from('training_programs')
        .select('name, created_at')
        .eq('status', 'active')
        .limit(2);

      // Get job postings closing soon
      const { data: jobs } = await supabase
        .from('job_postings')
        .select('title, closing_date')
        .eq('status', 'open')
        .gte('closing_date', currentDate)
        .order('closing_date', { ascending: true })
        .limit(2);

      // Get incubation projects with expected completion
      const { data: projects } = await supabase
        .from('incubation_projects')
        .select('name, expected_completion')
        .not('expected_completion', 'is', null)
        .gte('expected_completion', currentDate)
        .order('expected_completion', { ascending: true })
        .limit(1);

      const events = [];

      // Add program events
      programs?.forEach(program => {
        events.push({
          title: `${program.name} - Program Review`,
          date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'graduation',
          priority: 'high'
        });
      });

      // Add job events
      jobs?.forEach(job => {
        events.push({
          title: `${job.title} - Application Deadline`,
          date: job.closing_date,
          type: 'job-fair',
          priority: 'medium'
        });
      });

      // Add project events
      projects?.forEach(project => {
        events.push({
          title: `${project.name} - Completion Target`,
          date: project.expected_completion,
          type: 'competition',
          priority: 'high'
        });
      });

      // Add some system events if no data
      if (events.length === 0) {
        events.push(
          {
            title: 'System Health Check',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            type: 'meeting',
            priority: 'low'
          }
        );
      }

      return events.slice(0, 4); // Limit to 4 events
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="text-center space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 max-w-md w-full">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Welcome to YouthNet</h1>
            <p className="text-lg text-slate-600 mb-6">Management Information System</p>
            <p className="text-slate-500 mb-8">
              Empowering youth through comprehensive skill development, job placement, and entrepreneurship support.
            </p>
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const stats = [
    { title: 'Total Students', value: studentsCount.toString(), change: studentsCount > 0 ? '+12% from last month' : 'No students yet', changeType: 'positive' as const, icon: Users },
    { title: 'Active Trainers', value: trainersCount.toString(), change: trainersCount > 0 ? '+3 new this week' : 'No trainers yet', changeType: 'positive' as const, icon: GraduationCap },
    { title: 'Job Placements', value: jobPlacements.toString(), change: jobPlacements > 0 ? '+8% this quarter' : 'No placements yet', changeType: 'positive' as const, icon: Briefcase },
    { title: 'Incubation Projects', value: incubationProjects.toString(), change: incubationProjects > 0 ? '5 new startups' : 'No projects yet', changeType: 'positive' as const, icon: Building2 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-sm">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Dashboard Control Center
        </h1>
        <p className="text-slate-600 flex items-center gap-2 text-sm sm:text-base">
          <Zap className="h-4 w-4 text-blue-500" />
          Welcome back, <span className="text-blue-600 font-medium">{profile?.full_name || 'User'}</span> 
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-200">
            {profile?.role || 'student'}
          </span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className="transform transition-all duration-300 hover:scale-105">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Department Performance */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Department Performance</span>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(148 163 184 / 0.3)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgb(100 116 139)" 
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="rgb(100 116 139)" 
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgb(226 232 240)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar 
                    dataKey="students" 
                    fill="url(#blueGradient)" 
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(59 130 246)" />
                      <stop offset="100%" stopColor="rgb(99 102 241)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-500">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No department data available</p>
                  <p className="text-sm">Start adding students and programs to see statistics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placement Distribution */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Placement Distribution</span>
              <div className="ml-auto">
                <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {placementData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={placementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      dataKey="value"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                    >
                      {placementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid rgb(226 232 240)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {placementData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-500">
                <div className="text-center">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No placement data available</p>
                  <p className="text-sm">Job placements will appear here once students are placed</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Mission Control - Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors group">
                  <div className="flex-shrink-0">
                    {event.type === 'graduation' && <GraduationCap className="h-6 w-6 text-emerald-600" />}
                    {event.type === 'job-fair' && <Briefcase className="h-6 w-6 text-blue-600" />}
                    {event.type === 'competition' && <TrendingUp className="h-6 w-6 text-purple-600" />}
                    {event.type === 'meeting' && <Users className="h-6 w-6 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-slate-500">{event.date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.priority === 'high' ? 'bg-red-100 text-red-600 border border-red-200' :
                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 border border-yellow-200' :
                    'bg-green-100 text-green-600 border border-green-200'
                  }`}>
                    {event.priority}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No upcoming events</p>
                  <p className="text-sm">Events will appear here as they are scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Quick Actions</span>
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
                  className="w-full p-4 text-left rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 group transition-all duration-200"
                >
                  <div className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {action.desc}
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full mt-3 overflow-hidden">
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
