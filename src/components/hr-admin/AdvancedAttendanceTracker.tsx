import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Clock, 
  Calendar as CalendarIcon,
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Smartphone,
  Camera,
  Wifi,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const AdvancedAttendanceTracker = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');

  const [attendanceStats] = useState({
    totalEmployees: 248,
    presentToday: 234,
    absentToday: 8,
    lateToday: 6,
    onLeave: 12,
    workingRemote: 18,
    overtimeHours: 156,
    attendanceRate: 94.4
  });

  const [todayAttendance] = useState([
    {
      id: 1,
      employeeId: 'EMP-001',
      name: 'John Doe',
      department: 'Engineering',
      checkIn: '09:15 AM',
      checkOut: null,
      status: 'present',
      location: 'Office',
      method: 'face_recognition',
      workingHours: '5.5',
      breaks: 2,
      overtime: false
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      name: 'Jane Smith',
      department: 'Marketing',
      checkIn: '08:45 AM',
      checkOut: '06:30 PM',
      status: 'completed',
      location: 'Office',
      method: 'mobile_app',
      workingHours: '8.5',
      breaks: 3,
      overtime: true
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      name: 'Mike Johnson',
      department: 'Sales',
      checkIn: null,
      checkOut: null,
      status: 'absent',
      location: null,
      method: null,
      workingHours: '0',
      breaks: 0,
      overtime: false
    }
  ]);

  const [departments] = useState([
    {
      name: 'Engineering',
      total: 45,
      present: 43,
      avgHours: 8.2,
      productivity: 92
    },
    {
      name: 'Marketing',
      total: 22,
      present: 20,
      avgHours: 8.0,
      productivity: 88
    },
    {
      name: 'Sales',
      total: 38,
      present: 35,
      avgHours: 8.5,
      productivity: 95
    },
    {
      name: 'HR',
      total: 12,
      present: 12,
      avgHours: 7.8,
      productivity: 89
    }
  ]);

  const [leaveRequests] = useState([
    {
      id: 1,
      employeeId: 'EMP-005',
      name: 'Alice Brown',
      type: 'Sick Leave',
      from: '2024-01-25',
      to: '2024-01-26',
      days: 2,
      status: 'pending',
      reason: 'Medical appointment'
    },
    {
      id: 2,
      employeeId: 'EMP-006',
      name: 'Bob Wilson',
      type: 'Annual Leave',
      from: '2024-02-01',
      to: '2024-02-05',
      days: 5,
      status: 'approved',
      reason: 'Family vacation'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'late':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'absent':
        return 'bg-red-500/20 text-red-400';
      case 'remote':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCheckInMethod = (method: string) => {
    switch (method) {
      case 'face_recognition':
        return <Camera className="h-4 w-4" />;
      case 'mobile_app':
        return <Smartphone className="h-4 w-4" />;
      case 'rfid_card':
        return <Wifi className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Advanced Attendance Tracking</h2>
          <p className="text-muted-foreground">Real-time attendance monitoring with biometric integration</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="professional-button">
            <Clock className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-3xl font-bold text-green-400">{attendanceStats.presentToday}</p>
                <p className="text-xs text-muted-foreground">of {attendanceStats.totalEmployees} employees</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={(attendanceStats.presentToday / attendanceStats.totalEmployees) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent Today</p>
                <p className="text-3xl font-bold text-red-400">{attendanceStats.absentToday}</p>
                <p className="text-xs text-muted-foreground">Late: {attendanceStats.lateToday}</p>
              </div>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remote Work</p>
                <p className="text-3xl font-bold text-blue-400">{attendanceStats.workingRemote}</p>
                <p className="text-xs text-muted-foreground">Working from home</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-3xl font-bold text-purple-400">{attendanceStats.attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Today's Attendance */}
            <div className="md:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Today's Attendance</CardTitle>
                  <CardDescription>Real-time attendance status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAttendance.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {record.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold">{record.name}</div>
                            <div className="text-sm text-muted-foreground">{record.employeeId} • {record.department}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            {record.checkIn && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                In: {record.checkIn}
                              </div>
                            )}
                            {record.checkOut && (
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                Out: {record.checkOut}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-center">
                            <div className="text-sm font-semibold">{record.workingHours}h</div>
                            <div className="text-xs text-muted-foreground">worked</div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {record.method && getCheckInMethod(record.method)}
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Quick Stats */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-white/10"
                  />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Face Recognition Setup
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile App Config
                  </Button>
                  <Button className="w-full" variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Attendance Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Real-time Attendance Feed</CardTitle>
              <CardDescription>Live updates of check-ins and check-outs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Sarah Connor', action: 'checked in', time: '09:15 AM', method: 'Face Recognition' },
                  { name: 'John Matrix', action: 'checked out', time: '06:30 PM', method: 'Mobile App' },
                  { name: 'Ellen Ripley', action: 'checked in', time: '08:45 AM', method: 'RFID Card' },
                  { name: 'Dutch Schaefer', action: 'checked out', time: '05:15 PM', method: 'Face Recognition' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="font-medium">{activity.name}</span>
                      <span className="text-muted-foreground">{activity.action}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{activity.time}</div>
                      <div className="text-xs text-muted-foreground">{activity.method}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Department Attendance</CardTitle>
              <CardDescription>Attendance overview by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {departments.map((dept, index) => (
                  <Card key={index} className="p-6 border border-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{dept.name}</h3>
                        <Badge variant="outline">{dept.present}/{dept.total}</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Attendance Rate</span>
                            <span>{Math.round((dept.present / dept.total) * 100)}%</span>
                          </div>
                          <Progress value={(dept.present / dept.total) * 100} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Avg Hours:</span>
                            <div className="font-semibold">{dept.avgHours}h</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Productivity:</span>
                            <div className="font-semibold">{dept.productivity}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Manage employee leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <Card key={request.id} className="p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div>
                          <span className="font-semibold">{request.name}</span>
                          <span className="text-muted-foreground ml-2">({request.employeeId})</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.type} • {request.from} to {request.to} ({request.days} days)
                        </div>
                        <div className="text-sm">{request.reason}</div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={request.status === 'approved' ? 'bg-green-500/20 text-green-300' : 
                                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' : 
                                        'bg-red-500/20 text-red-300'}>
                          {request.status}
                        </Badge>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create custom attendance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Daily Attendance Report</Button>
                <Button className="w-full" variant="outline">Weekly Summary</Button>
                <Button className="w-full" variant="outline">Monthly Analytics</Button>
                <Button className="w-full" variant="outline">Overtime Report</Button>
                <Button className="w-full" variant="outline">Leave Balance Report</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{attendanceStats.attendanceRate}%</div>
                    <div className="text-sm text-muted-foreground">Average This Month</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Best Day</span>
                      <span className="text-sm font-semibold">Tuesday (96.2%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Hours</span>
                      <span className="text-sm font-semibold">09:00 - 10:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Remote Work</span>
                      <span className="text-sm font-semibold">22% increase</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};