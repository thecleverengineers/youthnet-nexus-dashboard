
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  Brain,
  Download,
  Eye,
  Calendar,
  Filter,
  Zap,
  Database,
  FileText,
  Sparkles,
  Bot,
  Activity,
  DollarSign,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AdvancedReportsAnalytics = () => {
  const [reports, setReports] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    activeEmployees: 0,
    todayAttendance: 0,
    openTasks: 0,
    payrollProcessing: 0,
    performanceAlerts: 0,
    systemHealth: 99.8
  });

  const [reportConfig, setReportConfig] = useState({
    title: '',
    type: 'performance',
    department: 'all',
    date_range: '30',
    format: 'pdf',
    schedule: 'manual'
  });

  useEffect(() => {
    fetchReports();
    fetchDashboards();
    generateAiInsights();
    startRealTimeUpdates();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('generated_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboards = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_dashboards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDashboards(data || []);
    } catch (error: any) {
      console.error('Failed to fetch dashboards:', error);
    }
  };

  const generateAiInsights = async () => {
    const insights = [
      {
        type: 'productivity_trend',
        title: 'Productivity Surge Detected',
        description: 'Team productivity increased by 23% this month, driven by improved task management',
        confidence: 0.91,
        impact: 'positive',
        trend: 'up',
        value: '+23%'
      },
      {
        type: 'cost_optimization',
        title: 'Resource Optimization Opportunity',
        description: 'AI identified potential 18% reduction in operational costs through workflow optimization',
        confidence: 0.85,
        impact: 'opportunity',
        savings: '$45,000'
      },
      {
        type: 'performance_prediction',
        title: 'Q2 Performance Forecast',
        description: 'Machine learning models predict 15% improvement in team performance metrics',
        confidence: 0.88,
        impact: 'positive',
        timeframe: 'Q2 2024'
      }
    ];
    setAiInsights(insights);
  };

  const startRealTimeUpdates = () => {
    // Simulate real-time data updates
    const updateData = () => {
      setRealTimeData({
        activeEmployees: Math.floor(Math.random() * 50) + 150,
        todayAttendance: Math.floor(Math.random() * 20) + 180,
        openTasks: Math.floor(Math.random() * 30) + 45,
        payrollProcessing: Math.floor(Math.random() * 5) + 12,
        performanceAlerts: Math.floor(Math.random() * 3) + 2,
        systemHealth: 99.5 + Math.random() * 0.5
      });
    };

    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  };

  const generateReport = async () => {
    if (!reportConfig.title || !reportConfig.type) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      toast.info('AI is generating your custom report...');
      
      // Simulate AI report generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockReportData = {
        summary: {
          totalEmployees: 205,
          performanceScore: 8.7,
          productivityIncrease: 23,
          costSavings: 45000
        },
        trends: {
          attendance: 'improving',
          performance: 'stable',
          satisfaction: 'increasing'
        }
      };

      const { data, error } = await supabase
        .from('reports')
        .insert({
          title: reportConfig.title,
          type: reportConfig.type,
          department: reportConfig.department !== 'all' ? reportConfig.department : null,
          data: mockReportData,
          file_url: `/reports/${Date.now()}_${reportConfig.type}.${reportConfig.format}`,
          generated_by: 'ai-system'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('AI report generated successfully with advanced analytics');
      setIsCreateReportOpen(false);
      setReportConfig({
        title: '',
        type: 'performance',
        department: 'all',
        date_range: '30',
        format: 'pdf',
        schedule: 'manual'
      });
      fetchReports();
    } catch (error: any) {
      toast.error('Failed to generate report');
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-500/30 bg-green-500/10';
      case 'opportunity': return 'border-blue-500/30 bg-blue-500/10';
      case 'warning': return 'border-orange-500/30 bg-orange-500/10';
      case 'negative': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Target className="h-4 w-4" />;
      case 'attendance': return <Clock className="h-4 w-4" />;
      case 'payroll': return <DollarSign className="h-4 w-4" />;
      case 'productivity': return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Header */}
      <Card className="futuristic-card bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-gradient flex items-center gap-2">
                  Advanced Reports & Analytics
                  <Brain className="h-5 w-5 text-cyan-400" />
                </CardTitle>
                <p className="text-muted-foreground">
                  AI-driven insights with real-time predictive analytics
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-cyan-500/20">
                <Bot className="h-4 w-4 mr-2" />
                AI Insights
              </Button>
              <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gradient">AI Report Generator</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Report Title *</label>
                      <Input
                        value={reportConfig.title}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Q1 Performance Analysis"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Report Type</label>
                        <Select 
                          value={reportConfig.type} 
                          onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="performance">📊 Performance</SelectItem>
                            <SelectItem value="attendance">⏰ Attendance</SelectItem>
                            <SelectItem value="payroll">💰 Payroll</SelectItem>
                            <SelectItem value="productivity">📈 Productivity</SelectItem>
                            <SelectItem value="comprehensive">🔍 Comprehensive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                        <Select 
                          value={reportConfig.department} 
                          onValueChange={(value) => setReportConfig(prev => ({ ...prev, department: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date Range</label>
                        <Select 
                          value={reportConfig.date_range} 
                          onValueChange={(value) => setReportConfig(prev => ({ ...prev, date_range: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 3 months</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Format</label>
                        <Select 
                          value={reportConfig.format} 
                          onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">📄 PDF</SelectItem>
                            <SelectItem value="excel">📊 Excel</SelectItem>
                            <SelectItem value="csv">📋 CSV</SelectItem>
                            <SelectItem value="powerpoint">📈 PowerPoint</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={generateReport}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate with AI
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateReportOpen(false)}
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

      {/* Real-Time Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-green-400">{realTimeData.activeEmployees}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-green-300">Live</p>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-3xl font-bold text-blue-400">{realTimeData.todayAttendance}</p>
                <p className="text-xs text-blue-300">Today</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tasks</p>
                <p className="text-3xl font-bold text-orange-400">{realTimeData.openTasks}</p>
                <p className="text-xs text-orange-300">Active</p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payroll Queue</p>
                <p className="text-3xl font-bold text-purple-400">{realTimeData.payrollProcessing}</p>
                <p className="text-xs text-purple-300">Processing</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-3xl font-bold text-red-400">{realTimeData.performanceAlerts}</p>
                <p className="text-xs text-red-300">Priority</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-3xl font-bold text-cyan-400">{realTimeData.systemHealth.toFixed(1)}%</p>
                <p className="text-xs text-cyan-300">Uptime</p>
              </div>
              <Database className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card className="futuristic-card bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            AI-Powered Business Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.impact)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                {insight.value && (
                  <p className="text-lg font-bold text-green-400 mb-2">{insight.value}</p>
                )}
                {insight.savings && (
                  <p className="text-sm font-semibold text-green-400 mb-2">
                    Potential savings: {insight.savings}
                  </p>
                )}
                <Button size="sm" variant="outline" className="hover:bg-cyan-500/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Explore
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Management */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Generated Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg h-20"></div>
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                          {getTypeIcon(report.type)}
                        </div>
                        <h3 className="font-semibold text-white text-lg">{report.title}</h3>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {report.type}
                        </Badge>
                        {report.generated_by === 'ai-system' && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Generated:</span> {format(new Date(report.generated_at), 'MMM dd, yyyy')}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {report.department || 'All'}
                        </div>
                        <div>
                          <span className="font-medium">Period:</span> {report.period_start ? `${format(new Date(report.period_start), 'MMM dd')} - ${format(new Date(report.period_end), 'MMM dd')}` : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Format:</span> PDF
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" className="hover:bg-blue-500/20">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" className="hover:bg-green-500/20">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No reports generated yet</h3>
              <p className="text-muted-foreground">Create your first AI-powered report to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
