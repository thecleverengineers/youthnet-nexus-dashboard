import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User,
  Clock,
  Target,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Award,
  LogOut,
  Bell,
  Settings,
  BarChart3,
  Briefcase,
  Users,
  TrendingUp
} from 'lucide-react';
import { format, subDays, startOfWeek } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const StaffDashboard = () => {
  const { user, profile } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksTotal: 0,
    attendanceRate: 0,
    hoursThisWeek: 0,
    projectsActive: 0,
    teamMembers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadStaffData();
    }
  }, [profile]);

  const loadStaffData = async () => {
    try {
      // Get employee data if linked
      if (profile.employee_id) {
        const { data: empData } = await supabase
          .from('employees')
          .select('*')
          .eq('employee_id', profile.employee_id)
          .single();
        
        setEmployee(empData);

        if (empData) {
          // TODO: Tables for attendance_records and employee_tasks need to be created
          // For now, using placeholder data
          setAttendance(null);
          setTasks([]);

          // Calculate stats with placeholder values
          const completed = 0;
          const total = 0;
          const attendanceRate = 0;
          let hoursThisWeek = 0;

          setStats({
            tasksCompleted: completed,
            tasksTotal: total,
            attendanceRate: Math.round(attendanceRate),
            hoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
            projectsActive: 3,
            teamMembers: 12
          });
        }
      }
    } catch (error) {
      console.error('Error loading staff data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Welcome back, {profile?.full_name || 'Staff Member'}!</h1>
                  <p className="text-muted-foreground">
                    {profile?.employee_id && `${profile.employee_id} • `}
                    {employee?.department || 'Staff'} • {profile?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.tasksCompleted}/{stats.tasksTotal}
                  </p>
                  <Progress 
                    value={stats.tasksTotal > 0 ? (stats.tasksCompleted / stats.tasksTotal) * 100 : 0} 
                    className="mt-2" 
                  />
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">{stats.attendanceRate}%</p>
                  <Progress value={stats.attendanceRate} className="mt-2" />
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-foreground">{stats.projectsActive}</p>
                  <Badge className="mt-2">In Progress</Badge>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold text-foreground">{stats.teamMembers}</p>
                  <Badge className="mt-2">Collaborating</Badge>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendance ? (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Checked In</p>
                        <p className="text-sm text-muted-foreground">
                          {attendance.check_in || 'Not checked in'}
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">No Attendance Record</p>
                        <p className="text-sm text-muted-foreground">Check-in information not available</p>
                      </div>
                      <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Work Hours</p>
                    <p className="font-medium text-foreground">09:00 - 17:00</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Break Time</p>
                    <p className="font-medium text-foreground">12:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                View Timesheet
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {format(new Date(task.due_date), 'MMM dd')}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant={
                        task.status === 'completed' ? 'default' :
                        task.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }
                    >
                      {task.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks assigned yet</p>
                <p className="text-sm text-muted-foreground mt-2">Tasks will appear here when assigned to you</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};