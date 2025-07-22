import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  LogOut,
  Activity,
  GraduationCap,
  UserPlus,
  TrendingUp,
  Zap,
  Crown,
  Star,
  ArrowUp,
  Eye,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { studentsCount, trainersCount, employeesCount, incubationProjects } = useDashboardData();

  const adminModules = [
    { 
      name: 'Student Management', 
      href: '/education', 
      icon: GraduationCap, 
      color: 'blue', 
      description: 'Manage student registrations and academic data',
      stats: `${studentsCount} Students`
    },
    { 
      name: 'HR & Admin', 
      href: '/hr-admin', 
      icon: Users, 
      color: 'purple',
      description: 'Human resources and administrative functions',
      stats: `${employeesCount} Employees`
    },
    { 
      name: 'Education Dept', 
      href: '/education-department', 
      icon: BookOpen, 
      color: 'green',
      description: 'Department administration and curriculum',
      stats: `${trainersCount} Trainers`
    },
    { 
      name: 'Skill Development', 
      href: '/skill-development', 
      icon: Activity, 
      color: 'cyan',
      description: 'Skills assessment and training programs',
      stats: 'Active Programs'
    },
    { 
      name: 'Job Centre', 
      href: '/job-centre', 
      icon: BarChart3, 
      color: 'orange',
      description: 'Job placements and career opportunities',
      stats: 'Placement Hub'
    },
    { 
      name: 'Inventory', 
      href: '/inventory', 
      icon: Database, 
      color: 'rose',
      description: 'Asset management and inventory tracking',
      stats: 'Asset Control'
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: BarChart3, 
      color: 'amber',
      description: 'Analytics and comprehensive reporting',
      stats: 'Data Insights'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings, 
      color: 'red',
      description: 'System configuration and preferences',
      stats: 'Admin Panel'
    },
  ];

  const totalUsers = studentsCount + trainersCount + employeesCount;
  const systemHealth = Math.min(98, Math.max(75, 75 + (totalUsers * 0.5)));
  const dataUsage = Math.min(85, Math.max(45, 45 + (totalUsers * 0.8)));

  const quickStats = [
    {
      title: 'Total Students',
      value: studentsCount,
      change: '+12.5%',
      trend: 'up',
      icon: GraduationCap,
      color: 'blue',
      description: 'Active enrollments'
    },
    {
      title: 'System Users',
      value: totalUsers,
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'purple',
      description: 'Platform members'
    },
    {
      title: 'Active Programs',
      value: incubationProjects,
      change: '+15.7%',
      trend: 'up',
      icon: Activity,
      color: 'green',
      description: 'Running initiatives'
    },
    {
      title: 'System Health',
      value: `${Math.round(systemHealth)}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Shield,
      color: 'cyan',
      description: 'Performance index'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Student',
      description: 'Register new participants',
      icon: UserPlus,
      href: '/education',
      color: 'blue'
    },
    {
      title: 'View All Students',
      description: 'Manage existing records',
      icon: Eye,
      href: '/education',
      color: 'purple'
    },
    {
      title: 'Student Analytics',
      description: 'Performance insights',
      icon: BarChart3,
      href: '/education',
      color: 'green'
    },
    {
      title: 'Generate Reports',
      description: 'Export system data',
      icon: TrendingUp,
      href: '/reports',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-8xl mx-auto space-y-12">
        
        {/* Premium Header */}
        <div className="premium-card fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl gradient-bg-primary flex items-center justify-center relative overflow-hidden">
                  <Shield className="h-10 w-10 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-bg-accent flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient-primary mb-2">
                  Admin Control Center
                </h1>
                <p className="text-xl text-muted-foreground flex items-center gap-3">
                  <Zap className="h-5 w-5 text-blue-400" />
                  Welcome back, <span className="text-gradient-secondary font-semibold">{profile?.full_name}</span>
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className="gradient-bg-primary text-white border-0 px-4 py-1.5">
                    <Star className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="status-indicator status-online"></div>
                    System Online
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={signOut} 
              className="premium-button bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30 hover:border-red-400 text-red-300 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Premium Quick Stats */}
        <div className="premium-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={stat.title} className={`premium-card hover-glow-${stat.color} fade-in-up stagger-${index + 1}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white counter-animate">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                      <ArrowUp className="h-3 w-3" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl gradient-bg-${stat.color} flex items-center justify-center floating`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full gradient-bg-${stat.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, (typeof stat.value === 'number' ? stat.value : 75))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Admin Modules */}
        <div className="premium-card slide-in-left">
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <span className="text-gradient-primary">Administration Modules</span>
              <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30">
                {adminModules.length} Modules
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="premium-dashboard-grid">
              {adminModules.map((module, index) => (
                <Link key={module.name} to={module.href} className="group">
                  <div className={`module-card stagger-${index + 1}`}>
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl gradient-bg-${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 floating`}>
                        <module.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-white group-hover:text-gradient-primary transition-all duration-300">
                            {module.name}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className={`gradient-bg-${module.color} text-white border-0 text-xs`}>
                            {module.stats}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            Click to access →
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </div>

        {/* Premium Student Management Actions */}
        <div className="premium-card slide-in-right">
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-xl gradient-bg-secondary flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-gradient-secondary">Student Management Hub</span>
              <Badge className="ml-auto bg-green-500/20 text-green-400 border-green-500/30">
                Quick Access
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link key={action.title} to={action.href} className="group">
                  <div className={`premium-card hover-glow-${action.color} stagger-${index + 1} p-6`}>
                    <div className="text-center">
                      <div className={`w-14 h-14 rounded-2xl gradient-bg-${action.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 floating`}>
                        <action.icon className="h-7 w-7 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-gradient-primary transition-all duration-300">
                        {action.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                      <div className="mt-4 h-1 bg-gray-800/50 rounded-full overflow-hidden">
                        <div className={`h-full gradient-bg-${action.color} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500`}></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </div>

        {/* Premium Footer */}
        <div className="text-center space-y-4 fade-in-up">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="status-indicator status-online"></div>
              <span>All Systems Operational</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <span className="text-gradient-primary font-mono">YouthNet v2.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
