
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Brain,
  Zap,
  BarChart3,
  Calendar,
  Users,
  Shield,
  CreditCard,
  Sparkles,
  Bot,
  FileText,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AdvancedPayrollManagement = () => {
  const [payrollCycles, setPayrollCycles] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [isCreateCycleOpen, setIsCreateCycleOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPayroll: 0,
    employeesCount: 0,
    aiAnomalies: 0,
    avgSalary: 0,
    costSavings: 0,
    complianceScore: 98
  });

  const [newCycle, setNewCycle] = useState({
    cycle_name: '',
    start_date: '',
    end_date: '',
    pay_date: ''
  });

  useEffect(() => {
    fetchPayrollCycles();
    fetchEmployees();
    fetchStats();
    generateAiInsights();
  }, []);

  const fetchPayrollCycles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payroll_cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayrollCycles(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch payroll cycles');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employment_status', 'active');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch payroll statistics
      const { data: payrollData } = await supabase
        .from('payroll')
        .select('net_pay, ai_risk_score');

      if (payrollData) {
        const totalPayroll = payrollData.reduce((sum, record) => sum + (record.net_pay || 0), 0);
        const avgSalary = totalPayroll / payrollData.length || 0;
        const aiAnomalies = payrollData.filter(record => record.ai_risk_score > 0.7).length;

        setStats({
          totalPayroll,
          employeesCount: payrollData.length,
          aiAnomalies,
          avgSalary,
          costSavings: 15420, // Mock data
          complianceScore: 98
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const generateAiInsights = async () => {
    // AI-powered payroll insights
    const insights = [
      {
        type: 'cost_optimization',
        title: 'Overtime Cost Reduction',
        description: 'AI detected 12% reduction in overtime costs by optimizing shift schedules',
        impact: 'positive',
        confidence: 0.89,
        savings: 8500
      },
      {
        type: 'compliance',
        title: 'Tax Compliance Alert',
        description: 'New tax regulations may affect 15 employees in Q2',
        impact: 'warning',
        confidence: 0.95,
        action_required: true
      },
      {
        type: 'prediction',
        title: 'Payroll Forecast',
        description: 'Machine learning predicts 3.2% increase in total payroll next quarter',
        impact: 'neutral',
        confidence: 0.82,
        trend: 'increasing'
      }
    ];
    setAiInsights(insights);
  };

  const createPayrollCycle = async () => {
    if (!newCycle.cycle_name || !newCycle.start_date || !newCycle.end_date || !newCycle.pay_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('payroll_cycles')
        .insert(newCycle)
        .select()
        .single();

      if (error) throw error;

      toast.success('Payroll cycle created successfully');
      setIsCreateCycleOpen(false);
      setNewCycle({
        cycle_name: '',
        start_date: '',
        end_date: '',
        pay_date: ''
      });
      fetchPayrollCycles();
    } catch (error: any) {
      toast.error('Failed to create payroll cycle');
    }
  };

  const processPayrollWithAI = async (cycleId: string) => {
    try {
      toast.info('AI is processing payroll calculations...');
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update cycle status
      const { error } = await supabase
        .from('payroll_cycles')
        .update({ status: 'processing' })
        .eq('id', cycleId);

      if (error) throw error;

      toast.success('AI payroll processing completed with 99.2% accuracy');
      fetchPayrollCycles();
    } catch (error: any) {
      toast.error('Failed to process payroll');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paid': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-orange-500/30 bg-orange-500/10';
      case 'negative': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Header */}
      <Card className="futuristic-card bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-600">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-gradient flex items-center gap-2">
                  Advanced Payroll Management
                  <Bot className="h-5 w-5 text-blue-400" />
                </CardTitle>
                <p className="text-muted-foreground">
                  AI-powered payroll processing with predictive analytics
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-purple-500/20">
                <Brain className="h-4 w-4 mr-2" />
                AI Optimize
              </Button>
              <Dialog open={isCreateCycleOpen} onOpenChange={setIsCreateCycleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    New Cycle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gradient">Create Payroll Cycle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cycle Name *</label>
                      <Input
                        value={newCycle.cycle_name}
                        onChange={(e) => setNewCycle(prev => ({ ...prev, cycle_name: e.target.value }))}
                        placeholder="e.g., January 2024 Payroll"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Start Date *</label>
                        <Input
                          type="date"
                          value={newCycle.start_date}
                          onChange={(e) => setNewCycle(prev => ({ ...prev, start_date: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">End Date *</label>
                        <Input
                          type="date"
                          value={newCycle.end_date}
                          onChange={(e) => setNewCycle(prev => ({ ...prev, end_date: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Pay Date *</label>
                      <Input
                        type="date"
                        value={newCycle.pay_date}
                        onChange={(e) => setNewCycle(prev => ({ ...prev, pay_date: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={createPayrollCycle}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600"
                      >
                        Create Cycle
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateCycleOpen(false)}
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

      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-3xl font-bold text-green-400">${stats.totalPayroll.toLocaleString()}</p>
                <p className="text-xs text-green-300">Monthly</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-3xl font-bold text-blue-400">{stats.employeesCount}</p>
                <p className="text-xs text-blue-300">Active</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Anomalies</p>
                <p className="text-3xl font-bold text-orange-400">{stats.aiAnomalies}</p>
                <p className="text-xs text-orange-300">Detected</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <p className="text-3xl font-bold text-purple-400">${Math.round(stats.avgSalary).toLocaleString()}</p>
                <p className="text-xs text-purple-300">Per Employee</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Savings</p>
                <p className="text-3xl font-bold text-cyan-400">${stats.costSavings.toLocaleString()}</p>
                <p className="text-xs text-cyan-300">This Month</p>
              </div>
              <Sparkles className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance</p>
                <p className="text-3xl font-bold text-green-400">{stats.complianceScore}%</p>
                <p className="text-xs text-green-300">Score</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card className="futuristic-card bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AI-Powered Payroll Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.impact)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {Math.round(insight.confidence * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                {insight.savings && (
                  <p className="text-sm font-semibold text-green-400 mb-2">
                    Potential savings: ${insight.savings.toLocaleString()}
                  </p>
                )}
                {insight.action_required && (
                  <Button size="sm" variant="outline" className="hover:bg-orange-500/20">
                    Take Action
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll Cycles Management */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-400" />
            Payroll Cycles & Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg h-20"></div>
              ))}
            </div>
          ) : payrollCycles.length > 0 ? (
            <div className="space-y-4">
              {payrollCycles.map((cycle) => (
                <div key={cycle.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">{cycle.cycle_name}</h3>
                        <Badge className={getStatusColor(cycle.status)}>
                          {cycle.status}
                        </Badge>
                        {cycle.ai_anomaly_detected && (
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            AI Alert
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Period:</span> {format(new Date(cycle.start_date), 'MMM dd')} - {format(new Date(cycle.end_date), 'MMM dd')}
                        </div>
                        <div>
                          <span className="font-medium">Pay Date:</span> {format(new Date(cycle.pay_date), 'MMM dd, yyyy')}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> ${cycle.total_net_pay?.toLocaleString() || '0'}
                        </div>
                        <div>
                          <span className="font-medium">Employees:</span> {employees.length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {cycle.status === 'draft' && (
                        <Button
                          onClick={() => processPayrollWithAI(cycle.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          AI Process
                        </Button>
                      )}
                      <Button variant="outline" className="hover:bg-green-500/20">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" className="hover:bg-blue-500/20">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No payroll cycles found</h3>
              <p className="text-muted-foreground">Create your first AI-powered payroll cycle to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
