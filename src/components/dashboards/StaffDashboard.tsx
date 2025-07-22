
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Settings,
  BarChart3,
  LogOut,
  Activity,
  GraduationCap,
  UserPlus,
  FileText,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Link } from 'react-router-dom';

export const StaffDashboard = () => {
  const { profile, signOut } = useAuth();
  const { studentsCount, trainersCount, employeesCount, incubationProjects } = useDashboardData();

  const staffModules = [
    { name: 'Student Management', href: '/education', icon: GraduationCap, color: 'blue', description: 'Manage student registrations and data' },
    { name: 'HR & Admin', href: '/hr-admin', icon: Users, color: 'blue' },
    { name: 'Skill Development', href: '/skill-development', icon: Activity, color: 'purple' },
    { name: 'Job Centre', href: '/job-centre', icon: BarChart3, color: 'orange' },
    { name: 'Reports', href: '/reports', icon: FileText, color: 'green' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
                  <p className="text-muted-foreground">Welcome, {profile?.full_name}</p>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mt-1">
                    Staff Member
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={signOut} className="hover:bg-blue-500/20">
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
                  <p className="text-sm text-muted-foreground">Active Trainers</p>
                  <p className="text-2xl font-bold text-green-400">{trainersCount}</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Programs</p>
                  <p className="text-2xl font-bold text-purple-400">{incubationProjects}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold text-orange-400">{employeesCount}</p>
                </div>
                <Users className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Modules */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-400" />
              Staff Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffModules.map((module) => (
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

        {/* Student Management Section */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              Student Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-3">
                      <UserPlus className="h-8 w-8 text-green-400" />
                      <div>
                        <h4 className="font-medium text-white">New Registration</h4>
                        <p className="text-sm text-muted-foreground">Register new students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-3">
                      <Users className="h-8 w-8 text-blue-400" />
                      <div>
                        <h4 className="font-medium text-white">View Students</h4>
                        <p className="text-sm text-muted-foreground">Manage student records</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-3">
                      <Calendar className="h-8 w-8 text-purple-400" />
                      <div>
                        <h4 className="font-medium text-white">Enrollment</h4>
                        <p className="text-sm text-muted-foreground">Manage enrollments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/education">
                <Card className="futuristic-card hover-lift cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center gap-3">
                      <BarChart3 className="h-8 w-8 text-orange-400" />
                      <div>
                        <h4 className="font-medium text-white">Analytics</h4>
                        <p className="text-sm text-muted-foreground">Performance reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <UserPlus className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-white">New student registration completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-white">Student assessment updated</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-white">New batch enrollment opened</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
