
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Plus, 
  Mail, 
  Download,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const ScheduledReports = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    reportType: '',
    frequency: 'weekly',
    time: '09:00',
    dayOfWeek: 'monday',
    dayOfMonth: 1,
    recipients: '',
    format: 'pdf',
    enabled: true,
  });

  const [scheduledReports] = useState([
    {
      id: 1,
      name: 'Weekly Student Performance',
      reportType: 'Student Performance Report',
      frequency: 'Weekly',
      schedule: 'Every Monday at 9:00 AM',
      nextRun: '2024-01-15 09:00',
      lastRun: '2024-01-08 09:00',
      status: 'active',
      recipients: 3,
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Monthly HR Summary',
      reportType: 'HR Summary Report',
      frequency: 'Monthly',
      schedule: '1st of every month at 8:00 AM',
      nextRun: '2024-02-01 08:00',
      lastRun: '2024-01-01 08:00',
      status: 'active',
      recipients: 5,
      format: 'Excel'
    },
    {
      id: 3,
      name: 'Daily System Usage',
      reportType: 'System Usage Report',
      frequency: 'Daily',
      schedule: 'Every day at 11:30 PM',
      nextRun: '2024-01-10 23:30',
      lastRun: '2024-01-09 23:30',
      status: 'paused',
      recipients: 2,
      format: 'CSV'
    },
    {
      id: 4,
      name: 'Quarterly Financial Report',
      reportType: 'Financial Overview',
      frequency: 'Quarterly',
      schedule: 'Every quarter on 1st at 6:00 AM',
      nextRun: '2024-04-01 06:00',
      lastRun: '2024-01-01 06:00',
      status: 'active',
      recipients: 8,
      format: 'PDF'
    }
  ]);

  const [reportHistory] = useState([
    {
      id: 1,
      scheduleName: 'Weekly Student Performance',
      executedAt: '2024-01-08 09:00:15',
      status: 'success',
      duration: '2m 34s',
      size: '2.4 MB',
      recipients: 3
    },
    {
      id: 2,
      scheduleName: 'Daily System Usage',
      executedAt: '2024-01-09 23:30:02',
      status: 'success',
      duration: '45s',
      size: '890 KB',
      recipients: 2
    },
    {
      id: 3,
      scheduleName: 'Monthly HR Summary',
      executedAt: '2024-01-01 08:00:12',
      status: 'failed',
      duration: '0s',
      size: '0 KB',
      recipients: 0,
      error: 'Database connection timeout'
    }
  ]);

  const handleCreateSchedule = () => {
    if (!newSchedule.name || !newSchedule.reportType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Schedule Created",
      description: `${newSchedule.name} has been scheduled successfully.`,
    });
    
    setShowCreateDialog(false);
    setNewSchedule({
      name: '',
      reportType: '',
      frequency: 'weekly',
      time: '09:00',
      dayOfWeek: 'monday',
      dayOfMonth: 1,
      recipients: '',
      format: 'pdf',
      enabled: true,
    });
  };

  const toggleSchedule = (scheduleId: number, enabled: boolean) => {
    toast({
      title: enabled ? "Schedule Activated" : "Schedule Paused",
      description: `Report schedule has been ${enabled ? 'activated' : 'paused'}.`,
    });
  };

  const runScheduleNow = (scheduleId: number) => {
    toast({
      title: "Report Generation Started",
      description: "The report is being generated and will be sent shortly.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Paused</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExecutionStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-300">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-300">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Scheduled Reports</h2>
          <p className="text-muted-foreground">Automate report generation and delivery</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="professional-button">
              <Plus className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Report Schedule</DialogTitle>
              <DialogDescription>Set up automated report generation and delivery</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleName">Schedule Name</Label>
                <Input
                  id="scheduleName"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="Enter schedule name..."
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={newSchedule.reportType} onValueChange={(value) => setNewSchedule({ ...newSchedule, reportType: value })}>
                  <SelectTrigger className="professional-input">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student_performance">Student Performance Report</SelectItem>
                    <SelectItem value="course_analytics">Course Analytics</SelectItem>
                    <SelectItem value="hr_summary">HR Summary Report</SelectItem>
                    <SelectItem value="financial_overview">Financial Overview</SelectItem>
                    <SelectItem value="system_usage">System Usage Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="professional-input"
                  />
                </div>
              </div>

              {newSchedule.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select value={newSchedule.dayOfWeek} onValueChange={(value) => setNewSchedule({ ...newSchedule, dayOfWeek: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients (Email addresses)</Label>
                <Input
                  id="recipients"
                  value={newSchedule.recipients}
                  onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                  placeholder="user1@example.com, user2@example.com"
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Report Format</Label>
                <Select value={newSchedule.format} onValueChange={(value) => setNewSchedule({ ...newSchedule, format: value })}>
                  <SelectTrigger className="professional-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newSchedule.enabled}
                  onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, enabled: checked })}
                />
                <Label htmlFor="enabled">Enable immediately</Label>
              </div>

              <Button onClick={handleCreateSchedule} className="w-full professional-button">
                Create Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Schedules */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Active Schedules
          </CardTitle>
          <CardDescription>Manage your automated report schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Schedule Name</TableHead>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledReports.map((schedule) => (
                  <TableRow key={schedule.id} className="border-white/10">
                    <TableCell>
                      <div>
                        <div className="font-medium">{schedule.name}</div>
                        <div className="text-sm text-muted-foreground">{schedule.schedule}</div>
                      </div>
                    </TableCell>
                    <TableCell>{schedule.reportType}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{schedule.frequency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{schedule.nextRun.split(' ')[0]}</div>
                        <div className="text-muted-foreground">{schedule.nextRun.split(' ')[1]}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {schedule.recipients}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runScheduleNow(schedule.id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSchedule(schedule.id, schedule.status === 'paused')}
                        >
                          {schedule.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Execution History
          </CardTitle>
          <CardDescription>Recent scheduled report executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Schedule Name</TableHead>
                  <TableHead>Executed At</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportHistory.map((execution) => (
                  <TableRow key={execution.id} className="border-white/10">
                    <TableCell className="font-medium">{execution.scheduleName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{execution.executedAt.split(' ')[0]}</div>
                        <div className="text-muted-foreground">{execution.executedAt.split(' ')[1]}</div>
                      </div>
                    </TableCell>
                    <TableCell>{execution.duration}</TableCell>
                    <TableCell>{execution.size}</TableCell>
                    <TableCell>{execution.recipients}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getExecutionStatusBadge(execution.status)}
                        {execution.error && (
                          <div className="text-xs text-red-400">{execution.error}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={execution.status !== 'success'}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        {execution.status === 'failed' && (
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
