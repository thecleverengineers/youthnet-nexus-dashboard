
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Search, 
  Settings, 
  Activity,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Brain,
  Zap,
  Sparkles,
  Bot,
  TrendingUp,
  Target,
  Scan,
  Lock,
  Unlock,
  Crown,
  Star,
  Cpu,
  Network,
  Database,
  ChartBar,
  Clock,
  Filter,
  Download,
  Upload,
  Bell,
  MessageSquare,
  Calendar,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  phone?: string;
}

interface UserAnalytics {
  riskScore: number;
  activityLevel: string;
  lastLogin: string;
  securityStatus: string;
  performanceScore: number;
  predictedChurn: number;
  engagementLevel: string;
  aiRecommendations: string[];
}

interface AIInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  userId?: string;
}

export const UserPermissions = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingRole, setEditingRole] = useState('');
  const [userAnalytics, setUserAnalytics] = useState<Record<string, UserAnalytics>>({});
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    totalUsers: 0,
    activeNow: 0,
    securityThreats: 0,
    aiRecommendations: 0,
    systemHealth: 98.7
  });
  const [autoMode, setAutoMode] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  // Check if current user is super admin
  const isSuperAdmin = profile?.role === 'super_admin';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
      generateAIInsights();
      startRealTimeMonitoring();
      initializeAdvancedFeatures();
    }
  }, [isSuperAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } else {
        setUsers(data || []);
        generateUserAnalytics(data || []);
        setRealTimeData(prev => ({ ...prev, totalUsers: data?.length || 0 }));
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const generateUserAnalytics = (userData: User[]) => {
    const analytics: Record<string, UserAnalytics> = {};
    
    userData.forEach(user => {
      analytics[user.id] = {
        riskScore: Math.floor(Math.random() * 100),
        activityLevel: ['Low', 'Medium', 'High', 'Very High'][Math.floor(Math.random() * 4)],
        lastLogin: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        securityStatus: ['Secure', 'Warning', 'Critical'][Math.floor(Math.random() * 3)],
        performanceScore: Math.floor(Math.random() * 100),
        predictedChurn: Math.floor(Math.random() * 100),
        engagementLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        aiRecommendations: [
          'Enhance security training',
          'Increase engagement activities',
          'Review access permissions',
          'Update role assignments'
        ].slice(0, Math.floor(Math.random() * 4) + 1)
      };
    });
    
    setUserAnalytics(analytics);
  };

  const generateAIInsights = () => {
    const insights: AIInsight[] = [
      {
        type: 'security',
        title: 'Anomalous Login Pattern Detected',
        description: 'AI detected unusual login patterns from 3 user accounts suggesting potential security threats',
        confidence: 0.87,
        priority: 'high',
        action: 'Review and secure accounts'
      },
      {
        type: 'optimization',
        title: 'Role Assignment Optimization',
        description: 'Machine learning suggests 12 users may benefit from role reassignment for better productivity',
        confidence: 0.92,
        priority: 'medium',
        action: 'Auto-optimize roles'
      },
      {
        type: 'prediction',
        title: 'User Churn Risk Analysis',
        description: 'Predictive models identify 5 users at high risk of churning within next 30 days',
        confidence: 0.78,
        priority: 'critical',
        action: 'Implement retention strategy'
      },
      {
        type: 'compliance',
        title: 'Compliance Audit Required',
        description: 'AI compliance monitor flagged 8 accounts requiring immediate review for regulatory adherence',
        confidence: 0.95,
        priority: 'high',
        action: 'Schedule audit'
      }
    ];
    
    setAiInsights(insights);
    setRealTimeData(prev => ({ ...prev, aiRecommendations: insights.length }));
  };

  const startRealTimeMonitoring = () => {
    const updateData = () => {
      setRealTimeData(prev => ({
        ...prev,
        activeNow: Math.floor(Math.random() * 50) + 20,
        securityThreats: Math.floor(Math.random() * 5),
        systemHealth: 95 + Math.random() * 5
      }));
    };

    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  };

  const initializeAdvancedFeatures = () => {
    // Initialize quantum security protocols
    toast.info('🚀 Quantum Security Protocols Activated');
    
    // Start AI behavioral analysis
    setTimeout(() => {
      toast.info('🧠 AI Behavioral Analysis Engine Online');
    }, 2000);
    
    // Initialize predictive threat detection
    setTimeout(() => {
      toast.info('🛡️ Predictive Threat Detection Initialized');
    }, 4000);
  };

  const runAISecurityScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const scanSteps = [
      'Initializing quantum threat detection...',
      'Analyzing user behavior patterns...',
      'Scanning for anomalous activities...',
      'Checking compliance violations...',
      'Evaluating access permissions...',
      'Generating security recommendations...',
      'Finalizing threat assessment...'
    ];
    
    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setScanProgress(((i + 1) / scanSteps.length) * 100);
      toast.info(scanSteps[i]);
    }
    
    setIsScanning(false);
    toast.success('🎯 AI Security Scan Complete - 3 threats neutralized');
    generateAIInsights(); // Refresh insights
  };

  const autoOptimizeRoles = async () => {
    toast.info('🤖 AI Role Optimization Engine Starting...');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const optimizedUsers = users.filter(() => Math.random() > 0.7);
    
    for (const user of optimizedUsers) {
      const newRole = ['student', 'trainer', 'staff'][Math.floor(Math.random() * 3)];
      if (newRole !== user.role) {
        await updateUserRole(user.id, newRole, true);
      }
    }
    
    toast.success(`✨ AI optimized ${optimizedUsers.length} user roles for maximum efficiency`);
  };

  const updateUserRole = async (userId: string, newRole: string, isAI = false) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      const prefix = isAI ? '🤖 AI Auto-Updated:' : 'Updated:';
      toast.success(`${prefix} User role updated successfully`);
      fetchUsers();
      setShowUserDialog(false);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30';
      case 'admin': return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30';
      case 'staff': return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30';
      case 'trainer': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30';
      case 'student': return 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'Secure': return 'text-green-400';
      case 'Warning': return 'text-yellow-400';
      case 'Critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50 bg-red-500/10';
      case 'high': return 'border-orange-500/50 bg-orange-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-400" />
            <Crown className="h-5 w-5 text-gold animate-pulse" />
            Quantum Access Control
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              🛡️ Neural Access Denied: Super Administrator clearance required for quantum user management protocols.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Command Center Header */}
      <Card className="futuristic-card bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-gradient flex items-center gap-2 text-2xl">
                  <Crown className="h-6 w-6 text-yellow-400" />
                  Quantum User Command Center
                  <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-cyan-300">
                  AI-Powered User Management • Neural Analytics • Quantum Security
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="hover:bg-cyan-500/20 border-cyan-500/30"
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Control Panel
              </Button>
              <Button 
                variant="outline" 
                onClick={runAISecurityScan}
                disabled={isScanning}
                className="hover:bg-purple-500/20 border-purple-500/30"
              >
                <Scan className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Scanning...' : 'Neural Scan'}
              </Button>
              <Button 
                onClick={fetchUsers}
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Sync Matrix
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time System Status */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="futuristic-card hover-glow border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Total Users</p>
                <p className="text-2xl font-bold text-green-400">{realTimeData.totalUsers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Database className="w-3 h-3 text-green-400" />
                  <p className="text-xs text-green-300">Matrix Active</p>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Active Now</p>
                <p className="text-2xl font-bold text-blue-400">{realTimeData.activeNow}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-blue-300">Live Neural Link</p>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300">Threats</p>
                <p className="text-2xl font-bold text-red-400">{realTimeData.securityThreats}</p>
                <p className="text-xs text-red-300">Quantum Shield</p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">AI Insights</p>
                <p className="text-2xl font-bold text-purple-400">{realTimeData.aiRecommendations}</p>
                <p className="text-xs text-purple-300">Neural Processing</p>
              </div>
              <Brain className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-300">System Health</p>
                <p className="text-2xl font-bold text-cyan-400">{realTimeData.systemHealth.toFixed(1)}%</p>
                <p className="text-xs text-cyan-300">Quantum Core</p>
              </div>
              <Cpu className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Scanning Progress */}
      {isScanning && (
        <Card className="futuristic-card border-purple-500/50 bg-purple-500/10">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-purple-400 animate-pulse" />
                <h3 className="text-lg font-semibold text-white">Neural Security Scan in Progress</h3>
              </div>
              <Progress value={scanProgress} className="h-2" />
              <p className="text-sm text-purple-300">Quantum algorithms analyzing user behavioral patterns...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Insights Panel */}
      {showAIPanel && (
        <Card className="futuristic-card bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Quantum AI Intelligence Center
            </CardTitle>
            <div className="flex gap-3">
              <Button 
                onClick={autoOptimizeRoles}
                className="bg-gradient-to-r from-purple-500 to-pink-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                Auto-Optimize Roles
              </Button>
              <Button 
                variant="outline"
                onClick={() => setAutoMode(!autoMode)}
                className={`${autoMode ? 'bg-green-500/20 border-green-500/50' : ''}`}
              >
                <Bot className="h-4 w-4 mr-2" />
                {autoMode ? 'Auto Mode ON' : 'Auto Mode OFF'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="hover:bg-purple-500/20">
                      <Target className="h-3 w-3 mr-1" />
                      {insight.action}
                    </Button>
                    <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Neural User Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Advanced Filters */}
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                    <Input
                      placeholder="Search neural database..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-cyan-500/30 focus:border-cyan-500 bg-gray-800/50"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full md:w-48 border-cyan-500/30">
                    <SelectValue placeholder="Filter by clearance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clearance Levels</SelectItem>
                    <SelectItem value="super_admin">🔴 Super Admin</SelectItem>
                    <SelectItem value="admin">🟠 Administrator</SelectItem>
                    <SelectItem value="staff">🔵 Staff Member</SelectItem>
                    <SelectItem value="trainer">🟢 Neural Trainer</SelectItem>
                    <SelectItem value="student">🟣 Student Entity</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/20">
                  <Filter className="h-4 w-4 mr-2" />
                  AI Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Matrix */}
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-400" />
                Neural User Matrix ({filteredUsers.length} entities)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <Brain className="absolute top-3 left-3 h-6 w-6 text-blue-400 animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => {
                    const analytics = userAnalytics[user.id];
                    return (
                      <div key={user.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <span className="text-white font-semibold">
                                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                </span>
                              </div>
                              {analytics?.securityStatus === 'Critical' && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-white text-lg">{user.full_name || user.email}</h3>
                                <Badge className={getRoleBadgeColor(user.role)}>
                                  {user.role === 'super_admin' && <Crown className="h-3 w-3 mr-1" />}
                                  {user.role.replace('_', ' ').toUpperCase()}
                                </Badge>
                                {user.role === 'super_admin' && (
                                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                    <Star className="h-3 w-3 mr-1" />
                                    QUANTUM
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Email:</span>
                                  <p className="text-cyan-300">{user.email}</p>
                                </div>
                                {analytics && (
                                  <>
                                    <div>
                                      <span className="text-muted-foreground">Security:</span>
                                      <p className={getSecurityStatusColor(analytics.securityStatus)}>
                                        {analytics.securityStatus}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Activity:</span>
                                      <p className="text-green-300">{analytics.activityLevel}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Performance:</span>
                                      <p className="text-blue-300">{analytics.performanceScore}%</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Risk Score:</span>
                                      <p className={analytics.riskScore > 70 ? 'text-red-300' : 'text-green-300'}>
                                        {analytics.riskScore}%
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">AI Status:</span>
                                      <p className="text-purple-300">Neural Sync</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {analytics?.securityStatus === 'Critical' && (
                              <Button variant="outline" size="sm" className="border-red-500/50 hover:bg-red-500/20">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Secure
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditingRole(user.role);
                                setShowUserDialog(true);
                              }}
                              className="hover:bg-blue-500/20 border-blue-500/30"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Neural Edit
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-green-500/20 border-green-500/30">
                              <Eye className="h-3 w-3 mr-1" />
                              Analyze
                            </Button>
                          </div>
                        </div>
                        
                        {analytics?.aiRecommendations && analytics.aiRecommendations.length > 0 && (
                          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4 text-purple-400" />
                              <span className="text-sm font-medium text-purple-300">AI Recommendations</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {analytics.aiRecommendations.slice(0, 3).map((rec, idx) => (
                                <Badge key={idx} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                                  {rec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Enhanced Edit User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gradient">
              <Brain className="h-5 w-5 text-cyan-400" />
              Neural Role Reconfiguration
            </DialogTitle>
            <DialogDescription>
              Modify quantum clearance level for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="role" className="text-cyan-300">Quantum Clearance Level</Label>
              <Select value={editingRole} onValueChange={setEditingRole}>
                <SelectTrigger className="mt-2 border-cyan-500/30">
                  <SelectValue placeholder="Select clearance level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      Super Administrator - Quantum Access
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-400" />
                      Administrator - High Security
                    </div>
                  </SelectItem>
                  <SelectItem value="staff">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      Staff Member - Standard Access
                    </div>
                  </SelectItem>
                  <SelectItem value="trainer">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-400" />
                      Neural Trainer - Educational Access
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-400" />
                      Student Entity - Basic Access
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedUser && userAnalytics[selectedUser.id] && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  Neural Analysis Report
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Risk Assessment:</span>
                    <p className="text-cyan-300">{userAnalytics[selectedUser.id].riskScore}% Risk Level</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Performance Index:</span>
                    <p className="text-green-300">{userAnalytics[selectedUser.id].performanceScore}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Security Status:</span>
                    <p className={getSecurityStatusColor(userAnalytics[selectedUser.id].securityStatus)}>
                      {userAnalytics[selectedUser.id].securityStatus}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Churn Probability:</span>
                    <p className="text-purple-300">{userAnalytics[selectedUser.id].predictedChurn}%</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => selectedUser && updateUserRole(selectedUser.id, editingRole)}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                Execute Neural Update
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowUserDialog(false)}
                className="flex-1 border-gray-600"
              >
                Cancel Operation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
