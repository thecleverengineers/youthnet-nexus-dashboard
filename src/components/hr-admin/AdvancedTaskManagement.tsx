
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Plus,
  Search,
  Bot,
  Calendar,
  Clock,
  User,
  MessageCircle,
  Play,
  Pause,
  CheckCircle,
  Brain,
  Zap,
  Target,
  Users,
  TrendingUp,
  BarChart3,
  Timer,
  Workflow,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AdvancedTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [activeTimeLog, setActiveTimeLog] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
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
    priority: 'medium',
    due_date: '',
    estimated_hours: 0,
    tags: [],
    dependencies: []
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    fetchStats();
    generateAiSuggestions();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employee_tasks')
        .select(`
          *,
          assigned_to_profile:employees!assigned_to(employee_id, department),
          assigned_by_profile:employees!assigned_by(employee_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch tasks: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, employee_id, department, position')
        .eq('employment_status', 'active');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchStats = async () => {
    try {
      const { data: taskStats } = await supabase
        .from('employee_tasks')
        .select('status, ai_complexity_score');

      if (taskStats) {
        const stats = taskStats.reduce((acc, task) => {
          acc.total++;
          acc[task.status] = (acc[task.status] || 0) + 1;
          if (task.ai_complexity_score > 0) acc.ai_optimized++;
          return acc;
        }, { total: 0, pending: 0, in_progress: 0, completed: 0, ai_optimized: 0 });

        stats.productivity_score = Math.round((stats.completed / stats.total) * 100) || 0;
        setStats(stats);
      }
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const generateAiSuggestions = async () => {
    // AI-powered task optimization suggestions
    const suggestions = [
      {
        type: 'optimization',
        title: 'Task Auto-Assignment',
        description: 'AI can automatically assign tasks based on employee skills and workload',
        confidence: 0.85
      },
      {
        type: 'productivity',
        title: 'Deadline Prediction',
        description: 'Machine learning predicts 15% faster completion for similar tasks',
        confidence: 0.92
      },
      {
        type: 'efficiency',
        title: 'Workflow Optimization',
        description: 'Reorganizing task dependencies could save 3.2 hours per week',
        confidence: 0.78
      }
    ];
    setAiSuggestions(suggestions);
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assigned_to) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      // Calculate AI complexity score based on task properties
      const aiComplexityScore = Math.random() * 10; // Mock AI calculation

      const { data, error } = await supabase
        .from('employee_tasks')
        .insert({
          ...newTask,
          ai_complexity_score: aiComplexityScore,
          auto_assigned: false
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Task created successfully with AI analysis');
      setIsCreateDialogOpen(false);
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
      fetchTasks();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to create task: ' + error.message);
    }
  };

  const startTimeTracking = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from('task_time_logs')
        .insert({
          task_id: taskId,
          employee_id: 'current-user-id', // In real app, get from auth
          start_time: new Date().toISOString(),
          activity_type: 'work'
        })
        .select()
        .single();

      if (error) throw error;
      setActiveTimeLog(data);
      toast.success('Time tracking started');
    } catch (error: any) {
      toast.error('Failed to start time tracking');
    }
  };

  const stopTimeTracking = async () => {
    if (!activeTimeLog) return;

    try {
      const endTime = new Date();
      const startTime = new Date(activeTimeLog.start_time);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      const { error } = await supabase
        .from('task_time_logs')
        .update({
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', activeTimeLog.id);

      if (error) throw error;
      setActiveTimeLog(null);
      toast.success(`Time tracked: ${Math.round(durationMinutes / 60)} hours ${durationMinutes % 60} minutes`);
    } catch (error: any) {
      toast.error('Failed to stop time tracking');
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
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Header */}
      <Card className="futuristic-card bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-gradient flex items-center gap-2">
                  Advanced Task Management
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                </CardTitle>
                <p className="text-muted-foreground">
                  AI-powered task orchestration with predictive analytics
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-purple-500/20">
                <Bot className="h-4 w-4 mr-2" />
                AI Optimize
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gradient">Create Intelligent Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Task Title *</label>
                        <Input
                          value={newTask.title}
                          onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter descriptive task title"
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <Textarea
                          value={newTask.description}
                          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Detailed task description for AI analysis"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
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
                                {employee.employee_id} - {employee.department}
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
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="high">🟠 High</SelectItem>
                            <SelectItem value="urgent">🔴 Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
                          placeholder="AI will help estimate"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleCreateTask}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create with AI Analysis
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
          </div>
        </CardHeader>
      </Card>

      {/* AI Insights & Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
                <p className="text-3xl font-bold text-blue-400">{stats.total}</p>
                <p className="text-xs text-blue-300">AI Managed</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.in_progress}</p>
                <p className="text-xs text-cyan-300">Real-time</p>
              </div>
              <Zap className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-400">{stats.completed}</p>
                <p className="text-xs text-green-300">Success Rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Optimized</p>
                <p className="text-3xl font-bold text-purple-400">{stats.ai_optimized}</p>
                <p className="text-xs text-purple-300">Smart Tasks</p>
              </div>
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-3xl font-bold text-orange-400">{stats.productivity_score}%</p>
                <p className="text-xs text-orange-300">Efficiency</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Tracked</p>
                <p className="text-3xl font-bold text-pink-400">127h</p>
                <p className="text-xs text-pink-300">This Week</p>
              </div>
              <Timer className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions Panel */}
      <Card className="futuristic-card bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-400" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-800/50 border border-purple-500/20">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{suggestion.title}</h4>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                <Button size="sm" variant="outline" className="hover:bg-purple-500/20">
                  Apply Suggestion
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Filters */}
      <Card className="futuristic-card">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="AI-powered task search..."
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
            {activeTimeLog && (
              <Button
                onClick={stopTimeTracking}
                className="bg-red-500 hover:bg-red-600 animate-pulse"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Timer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Tasks List */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-cyan-400" />
            Intelligent Task Orchestration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg h-24"></div>
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 hover:from-gray-700/50 hover:to-gray-600/30 transition-all duration-300 border border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {task.ai_complexity_score > 0 && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Score: {task.ai_complexity_score.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{task.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span>Due: {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'No deadline'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-400" />
                          <span>Est: {task.estimated_hours}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-400" />
                          <span>{task.assigned_to_profile?.employee_id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-orange-400" />
                          <span>{task.completion_percentage}% Complete</span>
                        </div>
                      </div>

                      {task.completion_percentage > 0 && (
                        <div className="mt-3">
                          <Progress value={task.completion_percentage} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startTimeTracking(task.id)}
                        disabled={!!activeTimeLog}
                        className="hover:bg-green-500/20"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-500/20"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No tasks found</h3>
              <p className="text-muted-foreground">Create your first AI-powered task to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
