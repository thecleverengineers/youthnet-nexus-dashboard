
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  TrendingUp,
  User,
  AlertTriangle,
  BarChart3,
  Users,
  Target
} from 'lucide-react';
import { attendanceService, AttendanceRecord } from '@/services/attendanceService';
import { format } from 'date-fns';

export const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onTime: 0,
    totalHours: 0,
    overtime: 0
  });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load employee session
    const session = localStorage.getItem('employee_session');
    if (session) {
      const empData = JSON.parse(session);
      setCurrentEmployee(empData);
      loadTodayAttendance(empData.id);
    }

    fetchAttendanceRecords();
    fetchStats();

    return () => clearInterval(timer);
  }, []);

  const loadTodayAttendance = async (employeeId: string) => {
    const attendance = await attendanceService.getTodayAttendance(employeeId);
    setTodayAttendance(attendance);
    setIsCheckedIn(!!(attendance?.check_in && !attendance?.check_out));
  };

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    const records = await attendanceService.fetchAttendanceRecords();
    setAttendanceRecords(records);
    setLoading(false);
  };

  const fetchStats = async () => {
    const records = await attendanceService.fetchAttendanceRecords();
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecords = records.filter(r => r.date === today);
    
    const stats = {
      present: todayRecords.filter(r => r.status === 'present').length,
      absent: todayRecords.filter(r => r.status === 'absent').length,
      late: todayRecords.filter(r => r.status === 'late').length,
      onTime: todayRecords.filter(r => r.status === 'present').length,
      totalHours: 200,
      overtime: 15
    };

    setStats(stats);
  };

  const handleCheckIn = async () => {
    if (!currentEmployee) return;
    
    const result = await attendanceService.checkIn(currentEmployee.id);
    if (result) {
      setTodayAttendance(result);
      setIsCheckedIn(true);
      fetchStats();
    }
  };

  const handleCheckOut = async () => {
    if (!currentEmployee) return;
    
    const result = await attendanceService.checkOut(currentEmployee.id);
    if (result) {
      setTodayAttendance(result);
      setIsCheckedIn(false);
      fetchStats();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'late': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'absent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'half_day': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'sick_leave': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'vacation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-400" />
                Advanced Attendance System
              </CardTitle>
              <p className="text-muted-foreground">
                Real-time workforce management
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-white">
                {format(currentTime, 'HH:mm:ss')}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(currentTime, 'EEEE, MMMM dd, yyyy')}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      {currentEmployee && (
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{currentEmployee.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentEmployee.employeeId} • {currentEmployee.department}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {!isCheckedIn ? (
                  <Button
                    onClick={handleCheckIn}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Check In
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckOut}
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                )}
              </div>
            </div>
            
            {todayAttendance && (
              <div className="mt-4 p-4 rounded-lg bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Check In</p>
                    <p className="font-medium text-green-400">
                      {todayAttendance.check_in ? 
                        format(new Date(todayAttendance.check_in), 'HH:mm') : 
                        'Not checked in'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check Out</p>
                    <p className="font-medium text-red-400">
                      {todayAttendance.check_out ? 
                        format(new Date(todayAttendance.check_out), 'HH:mm') : 
                        'Not checked out'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(todayAttendance.status)}>
                      {todayAttendance.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-3xl font-bold text-green-400">{stats.present}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Time</p>
                <p className="text-3xl font-bold text-blue-400">{stats.onTime}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late Arrivals</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.late}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent Today</p>
                <p className="text-3xl font-bold text-red-400">{stats.absent}</p>
              </div>
              <User className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg h-16"></div>
              ))}
            </div>
          ) : attendanceRecords.length > 0 ? (
            <div className="space-y-3">
              {attendanceRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {record.employees?.profiles?.full_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {record.employees?.employee_id} • {format(new Date(record.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">
                        {record.check_in ? format(new Date(record.check_in), 'HH:mm') : '--'} - 
                        {record.check_out ? format(new Date(record.check_out), 'HH:mm') : '--'}
                      </p>
                      <p className="text-white">
                        {record.notes || 'No notes'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No attendance records</h3>
              <p className="text-muted-foreground">Attendance data will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
