import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader,DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Target, 
  Brain, 
  TrendingUp,
  Users,
  Calendar,
  Filter,
  Plus,
  Search,
  BarChart3,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  completion_percentage: number;
  tags: string[];
  dependencies: string[];
  ai_complexity_score: number;
  auto_assigned: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface Employee {
  id: string;
  employee_id: string;
  position: string;
  department: string;
}

export const AdvancedTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    ai_optimized: 0,
    productivity_score: 0
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium' as const,
    due_date: '',
    estimated_hours: 0,
    tags: [] as string[],
    dependencies: [] as string[]
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const loadData = async () => {
    try {
      // Load employees from database
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, employee_id, position, department');

      if (employeesError) throw employeesError;

      const employeesList: Employee[] = employeesData?.map(emp => ({
        id: emp.id,
        employee_id: emp.employee_id,
        position: emp.position || 'Unknown Position',
        department: emp.department || 'Unknown Department'
      })) || [];

      // Mock tasks data instead of querying non-existent table
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Complete Q4 Performance Reviews',
          description: 'Conduct and finalize all employee performance reviews for Q4',
          assigned_to: employeesList[0]?.id || 'emp-1',
          assigned_by: 'manager-1',
          priority: 'high',
          status: 'in_progress',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimated_hours: 20,
          actual_hours: 12,
          completion_percentage: 60,
          tags: ['HR', 'Performance'],
          dependencies: [],
          ai_complexity_score: 0.7,
          auto_assigned: false,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Update Employee Handbook',
          description: 'Review and update company policies in the employee handbook',
          assigned_to: employeesList[1]?.id || 'emp-2',
          assigned_by: 'manager-1',
          priority: 'medium',
          status: 'pending',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimated_hours: 8,
          actual_hours: 0,
          completion_percentage: 0,
          tags: ['Documentation', 'Policy'],
          dependencies: [],
          ai_complexity_score: 0.4,
          auto_assigned: true,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Payroll System Integration',
          description: 'Integrate new payroll system with existing HR database',
          assigned_to: employeesList[0]?.id || 'emp-1',
          assigned_by: 'manager-1',
          priority: 'urgent',
          status: 'completed',
          due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estimated_hours: 16,
          actual_hours: 18,
          completion_percentage: 100,
          tags: ['Technology', 'Integration'],
          dependencies: [],
          ai_complexity_score: 0.9,
          auto_assigned: false,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setTasks(mockTasks);
      setEmployees(employeesList);
      calculateStats(mockTasks);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (taskData: Task[]) => {
    const total = taskData.length;
    const pending = taskData.filter(t => t.status === 'pending').length;
    const inProgress = taskData.filter(t => t.status === 'in_progress').length;
    const completed = taskData.filter(t => t.status === 'completed').length;
    const aiOptimized = taskData.filter(t => t.auto_assigned || t.ai_complexity_score > 0).length;
    const productivityScore = completed > 0 ? (completed / total) * 100 : 0;

    setStats({
      total,
      pending,
      in_progress: inProgress,
      completed,
      ai_optimized: aiOptimized,
      productivity_score: productivityScore
    });
  };

  const filterTasks = () => {
    let filtered = [...tasks];
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(filtered);
  };

  const handleCreateTask = async () => {
    try {
      const aiComplexityScore = calculateAIComplexity(newTask);
      const autoAssigned = shouldAutoAssign(newTask);

      const taskData: Task = {
        id: Date.now().toString(),
        ...newTask,
        assigned_by: 'current-user-id', // This should come from auth context
        ai_complexity_score: aiComplexityScore,
        auto_assigned: autoAssigned,
        completion_percentage: 0,
        actual_hours: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to mock data instead of database
      setTasks(prev => [taskData, ...prev]);

      toast.success('Task created successfully!');
      setIsCreateDialogOpen(false);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: '',
        estimated_hours: 0,
        tags: [],
        dependencies: []
      });

    } catch (error: any) {
      toast.error('Failed to create task: ' + error.message);
    }
  };

  const calculateAIComplexity = (task: any): number => {
    let score = 0;
    
    // Base complexity on description length and keywords
    if (task.description.length > 200) score += 0.3;
    if (task.estimated_hours > 20) score += 0.4;
    if (task.dependencies.length > 2) score += 0.3;
    
    // Check for technical keywords
    const technicalKeywords = ['api', 'database', 'algorithm', 'integration', 'analysis'];
    const hasComplexTerms = technicalKeywords.some(keyword => 
      task.title.toLowerCase().includes(keyword) || 
      task.description.toLowerCase().includes(keyword)
    );
    
    if (hasComplexTerms) score += 0.5;
    
    return Math.min(score, 1.0);
  };

  const shouldAutoAssign = (task: any): boolean => {
    // Simple AI logic for auto-assignment
    return task.priority === 'low' && task.estimated_hours <= 8;
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const updateData: Partial<Task> = {
        status: newStatus as any,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completion_percentage = 100;
      }

      // Update mock data instead of database
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updateData }
          : task
      ));

      toast.success('Task status updated!');
    } catch (error: any) {
      toast.error('Failed to update task: ' + error.message);
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
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 font-inter">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
            Intelligent Task Management
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-2">
            <Brain className="h-4 w-4 text-blue-400" />
            AI-powered task optimization and insights
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gradient">Create New Task</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Task Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="bg-gray-800/50 border-white/10 text-white"
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="bg-gray-800/50 border-white/10 text-white min-h-[120px] resize-none"
                  placeholder="Describe the task in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Assign To</label>
                  <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask({...newTask, assigned_to: value})}>
                    <SelectTrigger className="bg-gray-800/50 border-white/10 text-white">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/10">
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id} className="text-white hover:bg-gray-700">
                          {emp.employee_id} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Priority</label>
                  <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger className="bg-gray-800/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/10">
                      <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                      <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                      <SelectItem value="urgent" className="text-white hover:bg-gray-700">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Estimated Hours</label>
                  <Input
                    type="number"
                    value={newTask.estimated_hours}
                    onChange={(e) => setNewTask({...newTask, estimated_hours: parseFloat(e.target.value)})}
                    className="bg-gray-800/50 border-white/10 text-white"
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-white/20 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTask}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <Target className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">{stats.in_progress}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{stats.completed}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">AI Optimized</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">{stats.ai_optimized}</p>
              </div>
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">Productivity</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.productivity_score.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-6 w-6 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-800/50 border-white/10 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">All Status</SelectItem>
                  <SelectItem value="pending" className="text-white hover:bg-gray-700">Pending</SelectItem>
                  <SelectItem value="in_progress" className="text-white hover:bg-gray-700">In Progress</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-gray-700">Completed</SelectItem>
                  <SelectItem value="cancelled" className="text-white hover:bg-gray-700">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40 bg-gray-800/50 border-white/10 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-gray-700">All Priority</SelectItem>
                  <SelectItem value="urgent" className="text-white hover:bg-gray-700">Urgent</SelectItem>
                  <SelectItem value="high" className="text-white hover:bg-gray-700">High</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="low" className="text-white hover:bg-gray-700">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-400" />
            Tasks ({filteredTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-white/10">
              {filteredTasks.map((task) => {
                const assignedEmployee = employees.find(emp => emp.id === task.assigned_to);
                return (
                  <div key={task.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              {task.auto_assigned && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  AI Assigned
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{task.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                            <p className="text-white font-medium">
                              {assignedEmployee?.employee_id || 'Unassigned'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Due Date</p>
                            <p className="text-white font-medium">
                              {format(new Date(task.due_date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Progress</p>
                            <div className="flex items-center gap-2">
                              <Progress value={task.completion_percentage} className="flex-1 h-2"  />
                              <span className="text-xs text-white font-medium">{task.completion_percentage}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="text-xs bg-gray-800/50 px-2 py-1 rounded-full text-gray-300">
                            Est: {task.estimated_hours}h
                          </div>
                          <div className="text-xs bg-gray-800/50 px-2 py-1 rounded-full text-gray-300">
                            Actual: {task.actual_hours}h
                          </div>
                          {task.ai_complexity_score > 0 && (
                            <div className="text-xs bg-purple-500/20 px-2 py-1 rounded-full text-purple-400 border border-purple-500/30">
                              AI Complexity: {(task.ai_complexity_score * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-2">
                        {task.status !== 'completed' && (
                          <>
                            {task.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                              >
                                Start Task
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <Button
                                size="sm"
                                onClick={() => updateTaskStatus(task.id, 'completed')}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                              >
                                Complete
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Target className="h-16 w-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">No Tasks Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your filters to see more tasks' 
                  : 'Get started by creating your first task'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Task
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
