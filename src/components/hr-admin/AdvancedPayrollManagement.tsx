
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, DollarSign, AlertTriangle, TrendingUp, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const AdvancedPayrollManagement = () => {
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch payroll cycles
  const { data: payrollCycles, isLoading: cyclesLoading } = useQuery({
    queryKey: ['payroll-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_cycles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch current cycle payroll data
  const { data: payrollData, isLoading: payrollLoading } = useQuery({
    queryKey: ['payroll-data', selectedCycle],
    queryFn: async () => {
      if (!selectedCycle) return [];
      
      const { data, error } = await supabase
        .from('payroll')
        .select(`
          *,
          employees!inner(
            employee_id,
            position,
            department,
            profiles!inner(full_name)
          )
        `)
        .eq('payroll_cycle_id', selectedCycle);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCycle
  });

  // Fetch employees for payroll generation
  const { data: employees } = useQuery({
    queryKey: ['employees-for-payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Create new payroll cycle
  const createCycleMutation = useMutation({
    mutationFn: async (cycleData: any) => {
      const { data, error } = await supabase
        .from('payroll_cycles')
        .insert([cycleData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payroll-cycles'] });
      setSelectedCycle(data.id);
      toast.success('Payroll cycle created successfully');
    },
    onError: () => {
      toast.error('Failed to create payroll cycle');
    },
  });

  // Generate payroll for cycle
  const generatePayrollMutation = useMutation({
    mutationFn: async (cycleId: string) => {
      if (!employees) return;

      const payrollEntries = employees.map(employee => ({
        employee_id: employee.id,
        payroll_cycle_id: cycleId,
        gross_pay: 50000, // Base salary - in real app this would be calculated
        deductions: 5000, // Tax and other deductions
        net_pay: 45000, // Net after deductions
        ai_risk_score: Math.random() * 0.3 // Random AI risk score for demo
      }));

      const { error } = await supabase
        .from('payroll')
        .insert(payrollEntries);
      
      if (error) throw error;
      return payrollEntries;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-data'] });
      toast.success('Payroll generated successfully');
    },
    onError: () => {
      toast.error('Failed to generate payroll');
    },
  });

  const handleCreateCycle = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const payDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);

    createCycleMutation.mutate({
      cycle_name: `Payroll ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      pay_date: payDate.toISOString().split('T')[0],
      status: 'draft'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentCycle = payrollCycles?.find(cycle => cycle.id === selectedCycle);
  const totalNetPay = payrollData?.reduce((sum, entry) => sum + (entry.net_pay || 0), 0) || 0;
  const highRiskCount = payrollData?.filter(entry => (entry.ai_risk_score || 0)> 0.7).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Payroll Management</h2>
          <p className="text-gray-600">AI-powered payroll processing and analytics</p>
        </div>
        <Button onClick={handleCreateCycle} disabled={createCycleMutation.isPending}>
          <Calendar className="w-4 h-4 mr-2" />
          Create New Cycle
        </Button>
      </div>

      {/* Payroll Cycles */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {cyclesLoading ? (
              <div className="text-center py-4">Loading cycles...</div>
            ) : payrollCycles?.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No payroll cycles found. Create one to get started.
              </div>
            ) : (
              payrollCycles?.map((cycle) => (
                <div
                  key={cycle.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCycle === cycle.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCycle(cycle.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cycle.cycle_name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(cycle.start_date).toLocaleDateString()} - {new Date(cycle.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Pay Date: {new Date(cycle.pay_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(cycle.status || 'draft')}>
                        {cycle.status}
                      </Badge>
                      {cycle.total_net_pay && (
                        <span className="text-sm font-medium">
                          ${cycle.total_net_pay.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Cycle Details */}
      {currentCycle && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payrollData?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Total Payout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalNetPay.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  High Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  AI Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
              </CardContent>
            </Card>
          </div>

          {/* Payroll Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => generatePayrollMutation.mutate(selectedCycle)}
                  disabled={generatePayrollMutation.isPending || payrollData?.length > 0}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {payrollData?.length > 0 ? 'Payroll Generated' : 'Generate Payroll'}
                </Button>
                {payrollData?.length > 0 && (
                  <Button variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Process Payments
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payroll Details */}
          {payrollData?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Payroll Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollData?.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {entry.employees?.profiles?.full_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {entry.employees?.position} • {entry.employees?.department}
                          </p>
                          <p className="text-sm text-gray-600">
                            ID: {entry.employees?.employee_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${entry.net_pay?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Gross: ${entry.gross_pay?.toLocaleString()}
                          </div>
                          {entry.ai_risk_score && entry.ai_risk_score > 0.7 && (
                            <Badge variant="destructive" className="mt-1">
                              High Risk
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
