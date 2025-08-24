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
  TrendingUp,
  Award,
  Coffee,
  LogOut,
  Bell,
  Settings,
  BarChart3
} from 'lucide-react';
import { format, subDays, startOfWeek } from 'date-fns';
import { toast } from 'sonner';
import { supabaseHelpers, AttendanceRecord, EmployeeTask } from '@/utils/supabaseHelpers';

export const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksTotal: 0,
    attendanceRate: 0,
    hoursThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const loadEmployeeData = async () => {
    const session = localStorage.getItem('employee_session');
    if (!session) {
      toast.error('Please login first');
      return;
    }

    const empData = JSON.parse(session);
    setEmployee(empData);

    try {
      // Fetch today's attendance using existing attendance_records table
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: todayAttendance } = await supabaseHelpers.attendance_records
        .select('*')
        .eq('employee_id', empData.id)
        .eq('date', today)
        .single();

      setAttendance(todayAttendance as AttendanceRecord);

      // Fetch real employee tasks from new table
      const { data: tasksData, error: tasksError } = await supabaseHelpers.employee_tasks
        .select('*')
        .eq('assigned_to', empData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (tasksError) {
        console.log('No tasks found for employee');
        setTasks([]);
      } else {
        const convertedTasks: EmployeeTask[] = (tasksData as any[]).map(task => ({
          ...task,
          priority: task.priority as 'low' | 'medium' | 'high' | 'urgent',
          status: task.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
          tags: Array.isArray(task.tags) ? task.tags : [],
          dependencies: Array.isArray(task.dependencies) ? task.dependencies : []
        }));
        setTasks(convertedTasks);
      }

      // Calculate stats from tasks data
      const tasksToUse = tasks;
      const completed = tasksToUse.filter(t => t.status === 'completed').length;
      const total = tasksToUse.length;
      
      // Calculate real attendance rate for the employee
      const { data: attendanceData } = await supabaseHelpers.attendance_records
        .select('*')
        .eq('employee_id', empData.id)
        .gte('date', format(subDays(new Date(), 30), 'yyyy-MM-dd'));
      
      const attendanceRate = attendanceData && attendanceData.length > 0
        ? (attendanceData.filter((a: any) => a.status === 'present').length / attendanceData.length * 100)
        : 0;

      // Calculate hours this week
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const { data: weekAttendance } = await supabaseHelpers.attendance_records
        .select('*')
        .eq('employee_id', empData.id)
        .gte('date', format(weekStart, 'yyyy-MM-dd'));

      let hoursThisWeek = 0;
      if (weekAttendance) {
        weekAttendance.forEach((record: any) => {
          if (record.check_in && record.check_out) {
            const checkIn = new Date(`2000-01-01T${record.check_in}`);
            const checkOut = new Date(`2000-01-01T${record.check_out}`);
            const hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
            hoursThisWeek += hours;
          }
        });
      }

      setStats({
        tasksCompleted: completed,
        tasksTotal: total,
        attendanceRate: Math.round(attendanceRate),
        hoursThisWeek: Math.round(hoursThisWeek * 10) / 10
      });

    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('employee_session');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="futuristic-card w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Not Logged In</h3>
            <p className="text-muted-foreground mb-4">Please login to access your dashboard</p>
            <Button onClick={() => window.location.reload()}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome back, {employee.name}!</h1>
                  <p className="text-muted-foreground">{employee.employeeId} • {employee.department}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="hover:bg-blue-500/20">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="hover:bg-purple-500/20">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="hover:bg-red-500/20 border-red-500/30 text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="futuristic-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.tasksCompleted}/{stats.tasksTotal}
                  </p>
                  <Progress 
                    value={stats.tasksTotal > 0 ? (stats.tasksCompleted / stats.tasksTotal) * 100 : 0} 
                    className="mt-2" 
                  />
                </div>
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-green-400">{stats.attendanceRate}%</p>
                  <Progress value={stats.attendanceRate} className="mt-2" />
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours This Week</p>
                  <p className="text-2xl font-bold text-cyan-400">{stats.hoursThisWeek}h</p>
                  <Progress value={(stats.hoursThisWeek / 40) * 100} className="mt-2" />
                </div>
                <Clock className="h-8 w-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card hover-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <p className="text-2xl font-bold text-purple-400">Excellent</p>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mt-2">
                    Top Performer
                  </Badge>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="futuristic-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendance ? (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-400">Checked In</p>
                        <p className="text-sm text-muted-foreground">
                          {attendance.check_in ? 
                            format(new Date(attendance.check_in), 'HH:mm') : 
                            'Not checked in'
                          }
                        </p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-400">Not Checked In</p>
                        <p className="text-sm text-muted-foreground">Don't forget to check in</p>
                      </div>
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-sm text-muted-foreground">Break Time</p>
                    <p className="font-medium text-white">12:00 - 13:00</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/50">
                    <p className="text-sm text-muted-foreground">Work Hours</p>
                    <p className="font-medium text-white">09:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30">
                <Clock className="h-4 w-4 mr-2" />
                View Timesheet
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30">
                <Calendar className="h-4 w-4 mr-2" />
                Request Leave
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/30">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30">
                <User className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {format(new Date(task.due_date), 'MMM dd')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
