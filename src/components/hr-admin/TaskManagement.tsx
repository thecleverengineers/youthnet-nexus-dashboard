
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  MessageCircle,
  Paperclip
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 0
  });

  useEffect(() => {
    const session = localStorage.getItem('employee_session');
    if (session) {
      setCurrentEmployee(JSON.parse(session));
    }

    fetchTasks();
    fetchEmployees();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // For now, we'll use a simple mock implementation since employee_tasks table doesn't exist
      // In a real implementation, this would query the employee_tasks table
      const mockTasks = [
        {
          id: '1',
          title: 'Complete Monthly Report',
          description: 'Prepare and submit the monthly performance report',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-20',
          estimated_hours: 8,
          created_at: new Date().toISOString(),
          assigned_to: 'emp001',
          assigned_by: 'manager001'
        },
        {
          id: '2',
          title: 'Update Employee Database',
          description: 'Update employee information in the system',
          priority: 'medium',
          status: 'in_progress',
          due_date: '2024-01-25',
          estimated_hours: 4,
          created_at: new Date().toISOString(),
          assigned_to: 'emp002',
          assigned_by: 'manager001'
        }
      ];
      
      setTasks(mockTasks);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          employee_id,
          department,
          position,
          profiles (full_name)
        `)
        .eq('employment_status', 'active');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchStats = async () => {
    // Mock stats for now
    const mockStats = {
      total: 25,
      pending: 8,
      in_progress: 12,
      completed: 4,
      overdue: 1
    };
    setStats(mockStats);
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assigned_to) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      // Mock implementation - would normally insert into employee_tasks table
      const task = {
        ...newTask,
        id: Date.now().toString(),
        status: 'pending',
        created_at: new Date().toISOString(),
        assigned_by: currentEmployee?.id
      };

      setTasks(prev => [task, ...prev]);
      toast.success('Task created successfully');
      setIsCreateDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: '',
        estimated_hours: 0
      });
    } catch (error: any) {
      toast.error('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      toast.success('Task status updated');
    } catch (error: any) {
      toast.error('Failed to update task status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-400" />
                Task Management System
              </CardTitle>
              <p className="text-muted-foreground">
                AI-powered task assignment and tracking
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-gradient">Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Title *</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Assign To *</label>
                      <Select 
                        value={newTask.assigned_to} 
                        onValueChange={(value) => setNewTask(prev => ({ ...prev, assigned_to: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.profiles?.full_name} ({employee.employee_id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priority</label>
                      <Select 
                        value={newTask.priority} 
                        onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                      <Input
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estimated Hours</label>
                      <Input
                        type="number"
                        value={newTask.estimated_hours}
                        onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateTask}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                      Create Task
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-400">{stats.in_progress}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-400">{stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="futuristic-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Tasks Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg h-20"></div>
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{task.estimated_hours}h estimated</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Assigned to: {task.assigned_to}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {task.status !== 'completed' && (
                        <Select value={task.status} onValueChange={(value) => updateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-muted-foreground">Create your first task to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
