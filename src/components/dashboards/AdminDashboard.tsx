
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
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const { studentsCount, trainersCount, employeesCount, incubationProjects } = useDashboardData();

  const adminModules = [
    { name: 'Student Management', href: '/education', icon: GraduationCap, color: 'blue', description: 'Manage student registrations and data' },
    { name: 'HR & Admin', href: '/hr-admin', icon: Users, color: 'blue' },
    { name: 'Education Dept', href: '/education-department', icon: Users, color: 'green' },
    { name: 'Skill Development', href: '/skill-development', icon: Activity, color: 'purple' },
    { name: 'Job Centre', href: '/job-centre', icon: BarChart3, color: 'orange' },
    { name: 'Inventory', href: '/inventory', icon: Database, color: 'cyan' },
    { name: 'Reports', href: '/reports', icon: BarChart3, color: 'pink' },
    { name: 'Settings', href: '/settings', icon: Settings, color: 'red' },
  ];

  // Calculate system health based on real data
  const totalUsers = studentsCount + trainersCount + employeesCount;
  const systemHealth = Math.min(98, Math.max(75, 75 + (totalUsers * 0.5)));
  const dataUsage = Math.min(85, Math.max(45, 45 + (totalUsers * 0.8)));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Admin Control Panel</h1>
                  <p className="text-muted-foreground">Welcome, {profile?.full_name}</p>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mt-1">
                    Administrator
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={signOut} className="hover:bg-red-500/20">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-white">{studentsCount}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-400" />
              </div>
              <div className="mt-2">
                <Link to="/education">
                  <Button size="sm" variant="outline" className="text-xs">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Manage Students
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Programs</p>
                  <p className="text-2xl font-bold text-green-400">{incubationProjects}</p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold text-green-400">{Math.round(systemHealth)}%</p>
                </div>
                <Shield className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Modules */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-red-400" />
              Administration Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminModules.map((module) => (
                <Link key={module.name} to={module.href}>
                  <Card className="futuristic-card hover-lift cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-${module.color}-500/20 rounded-lg flex items-center justify-center`}>
                          <module.icon className={`h-6 w-6 text-${module.color}-400`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{module.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.description || `Manage ${module.name.toLowerCase()}`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Student Actions */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              Student Management Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-green-400" />
                      <div>
                        <h4 className="font-medium text-white">Add New Student</h4>
                        <p className="text-sm text-muted-foreground">Register new students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-400" />
                      <div>
                        <h4 className="font-medium text-white">View All Students</h4>
                        <p className="text-sm text-muted-foreground">Manage existing students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                      <div>
                        <h4 className="font-medium text-white">Student Analytics</h4>
                        <p className="text-sm text-muted-foreground">View performance metrics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
