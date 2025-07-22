
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Premium Light Header */}
        <div className="premium-card fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl gradient-bg-primary flex items-center justify-center relative overflow-hidden">
                  <Shield className="h-8 w-8 text-white relative z-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full gradient-bg-accent flex items-center justify-center">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gradient-primary mb-1">
                  Admin Control Center
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Welcome back, <span className="text-gradient-secondary font-medium">{profile?.full_name}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="gradient-bg-primary text-white border-0 px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Administrator
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="status-indicator status-online"></div>
                    System Online
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={signOut} 
              className="premium-button bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Premium Light Quick Stats */}
        <div className="premium-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={stat.title} className={`premium-card hover-glow-${stat.color} fade-in-up stagger-${index + 1}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </p>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <ArrowUp className="h-2.5 w-2.5" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-bg-${stat.color} flex items-center justify-center floating`}>
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full gradient-bg-${stat.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(100, (typeof stat.value === 'number' ? Math.min(stat.value, 100) : 75))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Light Admin Modules */}
        <div className="premium-card slide-in-left">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <span className="text-gradient-primary">Administration Modules</span>
              <Badge variant="secondary" className="ml-auto">
                {adminModules.length} Modules
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="premium-dashboard-grid">
              {adminModules.map((module, index) => (
                <Link key={module.name} to={module.href} className="group">
                  <div className={`module-card stagger-${index + 1}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl gradient-bg-${module.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 floating`}>
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base sm:text-lg font-medium text-foreground group-hover:text-gradient-primary transition-all duration-300 truncate">
                            {module.name}
                          </h3>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-relaxed">
                          {module.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-xs border-${module.color}-200 text-${module.color}-700`}>
                            {module.stats}
                          </Badge>
                          <div className="text-xs text-muted-foreground hidden sm:block">
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

        {/* Premium Light Student Management Actions */}
        <div className="premium-card slide-in-right">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-lg gradient-bg-secondary flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-gradient-secondary">Student Management Hub</span>
              <Badge variant="secondary" className="ml-auto">
                Quick Access
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.title} to={action.href} className="group">
                  <div className={`premium-card hover-glow-${action.color} stagger-${index + 1} p-4 text-center`}>
                    <div className={`w-12 h-12 rounded-xl gradient-bg-${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300 floating`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-gradient-primary transition-all duration-300">
                      {action.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                    <div className="mt-3 h-0.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full gradient-bg-${action.color} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500`}></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </div>

        {/* Premium Light Footer */}
        <div className="text-center space-y-3 fade-in-up pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="status-indicator status-online"></div>
              <span>All Systems Operational</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground"></div>
            <span>Last Updated: {new Date().toLocaleTimeString()}</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground"></div>
            <span className="text-gradient-primary font-mono">YouthNet v2.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
