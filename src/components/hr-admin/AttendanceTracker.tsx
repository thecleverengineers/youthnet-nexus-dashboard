
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Plus, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

export const AttendanceTracker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['attendance-records', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_tracking')
        .select(`
          *,
          employees:employee_id (
            employee_id,
            position,
            profiles:user_id (
              full_name
            )
          )
        `)
        .eq('date', selectedDate)
        .order('check_in_time');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: employees } = useQuery({
    queryKey: ['employees-for-attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          employee_id,
          position,
          profiles:user_id (
            full_name
          )
        `)
        .eq('employment_status', 'active')
        .order('employee_id');

      if (error) throw error;
      return data || [];
    }
  });

  const markAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: any) => {
      const { data, error } = await supabase
        .from('attendance_tracking')
        .insert([attendanceData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error: any) => {
      toast.error(`Error marking attendance: ${error.message}`);
    }
  });

  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('attendance_tracking')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance-records'] });
      toast.success('Attendance updated successfully');
    }
  });

  const handleCheckIn = (employeeId: string) => {
    const now = new Date().toISOString();
    markAttendanceMutation.mutate({
      employee_id: employeeId,
      date: selectedDate,
      check_in_time: now,
      status: 'present'
    });
  };

  const handleCheckOut = (recordId: string, checkInTime: string) => {
    const now = new Date().toISOString();
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(now);
    const totalHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    
    updateAttendanceMutation.mutate({
      id: recordId,
      check_out_time: now,
      total_hours: totalHours
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'on_leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Calculate summary stats
  const presentCount = attendanceRecords?.filter(r => r.status === 'present').length || 0;
  const totalEmployees = employees?.length || 0;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;
  const avgHours = attendanceRecords?.reduce((sum, r) => sum + (r.total_hours || 0), 0) / (presentCount || 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-3xl font-bold text-green-600">{presentCount}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold text-primary">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-3xl font-bold text-blue-600">{attendanceRate}%</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Hours</p>
                <p className="text-3xl font-bold text-orange-600">{avgHours.toFixed(1)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Attendance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Tracker
              </CardTitle>
              <CardDescription>Track employee attendance and working hours</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading attendance records...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees?.map((employee) => {
                  const record = attendanceRecords?.find(r => r.employee_id === employee.id);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.profiles?.full_name}</div>
                          <div className="text-sm text-muted-foreground">{employee.employee_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {record?.check_in_time ? formatTime(record.check_in_time) : '-'}
                      </TableCell>
                      <TableCell>
                        {record?.check_out_time ? formatTime(record.check_out_time) : '-'}
                      </TableCell>
                      <TableCell>
                        {record?.total_hours ? `${record.total_hours.toFixed(1)}h` : '-'}
                      </TableCell>
                      <TableCell>
                        {record ? (
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.replace('_', ' ')}
                          </Badge>
                        ) : (
                          <Badge className={getStatusColor('absent')}>Absent</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!record ? (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(employee.id)}
                          >
                            Check In
                          </Button>
                        ) : !record.check_out_time ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(record.id, record.check_in_time)}
                          >
                            Check Out
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Complete</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
