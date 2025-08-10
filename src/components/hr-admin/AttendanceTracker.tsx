
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { 
  Clock, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  MapPin
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  hoursWorked: number;
  notes: string;
  location: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  shiftStart: string;
  shiftEnd: string;
}

export const AttendanceTracker = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isMarkDialogOpen, setIsMarkDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const employees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      department: 'Administration',
      position: 'Admin Assistant',
      shiftStart: '09:00',
      shiftEnd: '17:00'
    },
    {
      id: '2',
      name: 'Mary Konyak',
      department: 'Education',
      position: 'Training Coordinator',
      shiftStart: '08:30',
      shiftEnd: '16:30'
    },
    {
      id: '3',
      name: 'David Ao',
      department: 'IT',
      position: 'System Administrator',
      shiftStart: '09:30',
      shiftEnd: '17:30'
    },
    {
      id: '4',
      name: 'Sarah Angami',
      department: 'HR',
      position: 'HR Specialist',
      shiftStart: '09:00',
      shiftEnd: '17:00'
    }
  ];

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: '1',
      employeeName: 'John Doe',
      department: 'Administration',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:15',
      checkOut: '17:05',
      status: 'late',
      hoursWorked: 7.83,
      notes: 'Traffic delay',
      location: 'Main Office'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Mary Konyak',
      department: 'Education',
      date: new Date().toISOString().split('T')[0],
      checkIn: '08:25',
      checkOut: '16:35',
      status: 'present',
      hoursWorked: 8.17,
      notes: '',
      location: 'Training Center'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'David Ao',
      department: 'IT',
      date: new Date().toISOString().split('T')[0],
      checkIn: null,
      checkOut: null,
      status: 'absent',
      hoursWorked: 0,
      notes: 'Sick leave',
      location: ''
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Sarah Angami',
      department: 'HR',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: null,
      status: 'present',
      hoursWorked: 0,
      notes: 'Currently working',
      location: 'HR Office'
    }
  ]);

  const [newAttendance, setNewAttendance] = useState({
    employeeId: '',
    checkIn: '',
    checkOut: '',
    status: 'present',
    notes: '',
    location: 'Main Office'
  });

  const departments = ['Administration', 'Education', 'IT', 'HR', 'Finance'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'half_day': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'leave': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'half_day': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'leave': return <CalendarIcon className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesDate = record.date === selectedDate.toISOString().split('T')[0];
    return matchesSearch && matchesDepartment && matchesStatus && matchesDate;
  });

  const handleMarkAttendance = () => {
    if (!newAttendance.employeeId || !selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee",
        variant: "destructive"
      });
      return;
    }

    const hoursWorked = newAttendance.checkIn && newAttendance.checkOut ? 
      calculateHours(newAttendance.checkIn, newAttendance.checkOut) : 0;

    const attendanceRecord: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId: newAttendance.employeeId,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      date: selectedDate.toISOString().split('T')[0],
      checkIn: newAttendance.checkIn || null,
      checkOut: newAttendance.checkOut || null,
      status: newAttendance.status as any,
      hoursWorked,
      notes: newAttendance.notes,
      location: newAttendance.location
    };

    setAttendanceRecords(prev => [...prev.filter(r => r.employeeId !== newAttendance.employeeId || r.date !== selectedDate.toISOString().split('T')[0]), attendanceRecord]);
    setNewAttendance({ employeeId: '', checkIn: '', checkOut: '', status: 'present', notes: '', location: 'Main Office' });
    setSelectedEmployee(null);
    setIsMarkDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Attendance marked successfully"
    });
  };

  const calculateHours = (checkIn: string, checkOut: string): number => {
    const [inHour, inMinute] = checkIn.split(':').map(Number);
    const [outHour, outMinute] = checkOut.split(':').map(Number);
    const inTime = inHour + inMinute / 60;
    const outTime = outHour + outMinute / 60;
    return Math.max(0, outTime - inTime);
  };

  const stats = {
    totalEmployees: employees.length,
    present: filteredRecords.filter(r => r.status === 'present' || r.status === 'late').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    late: filteredRecords.filter(r => r.status === 'late').length,
    attendanceRate: filteredRecords.length > 0 ? 
      Math.round((filteredRecords.filter(r => r.status === 'present' || r.status === 'late').length / filteredRecords.length) * 100) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Tracker</h2>
          <p className="text-muted-foreground">Track and manage employee attendance records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isMarkDialogOpen} onOpenChange={setIsMarkDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee *</Label>
                  <Select 
                    value={newAttendance.employeeId} 
                    onValueChange={(value) => {
                      setNewAttendance(prev => ({ ...prev, employeeId: value }));
                      setSelectedEmployee(employees.find(e => e.id === value) || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={newAttendance.status} 
                    onValueChange={(value) => setNewAttendance(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="half_day">Half Day</SelectItem>
                      <SelectItem value="leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newAttendance.status !== 'absent' && newAttendance.status !== 'leave' && (
                  <>
                    <div>
                      <Label htmlFor="checkIn">Check In Time</Label>
                      <Input
                        id="checkIn"
                        type="time"
                        value={newAttendance.checkIn}
                        onChange={(e) => setNewAttendance(prev => ({ ...prev, checkIn: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check Out Time</Label>
                      <Input
                        id="checkOut"
                        type="time"
                        value={newAttendance.checkOut}
                        onChange={(e) => setNewAttendance(prev => ({ ...prev, checkOut: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Select 
                        value={newAttendance.location} 
                        onValueChange={(value) => setNewAttendance(prev => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Office">Main Office</SelectItem>
                          <SelectItem value="Training Center">Training Center</SelectItem>
                          <SelectItem value="HR Office">HR Office</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAttendance.notes}
                    onChange={(e) => setNewAttendance(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes (optional)"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleMarkAttendance} className="flex-1">Mark Attendance</Button>
                  <Button variant="outline" onClick={() => setIsMarkDialogOpen(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Present</p>
                <p className="text-2xl font-bold">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Late</p>
                <p className="text-2xl font-bold">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">{stats.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Selection and Filters */}
      <div className="flex gap-4 items-center">
        <div>
          <Label>Date</Label>
          <div className="mt-1">
            <Input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-48"
            />
          </div>
        </div>
        <div className="flex-1">
          <Label>Search Employee</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label>Department</Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="half_day">Half Day</SelectItem>
              <SelectItem value="leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(record.status)}
                    <h3 className="text-lg font-semibold">{record.employeeName}</h3>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">{record.department}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Date:</span> {new Date(record.date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Check In:</span> {record.checkIn || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Check Out:</span> {record.checkOut || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Hours:</span> {record.hoursWorked.toFixed(2)}h
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {record.location || 'N/A'}
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{record.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No attendance records found</h3>
              <p className="text-muted-foreground">
                No attendance records for the selected date and filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
