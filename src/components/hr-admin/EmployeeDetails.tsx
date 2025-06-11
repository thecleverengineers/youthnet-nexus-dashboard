
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Edit,
  Building,
  Clock,
  CreditCard,
  Award,
  FileText,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeDetailsProps {
  employee: any;
  onClose: () => void;
  onEdit: () => void;
}

export const EmployeeDetails = ({ employee, onClose, onEdit }: EmployeeDetailsProps) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [training, setTraining] = useState([]);

  useEffect(() => {
    fetchEmployeeData();
  }, [employee.id]);

  const fetchEmployeeData = async () => {
    try {
      // Fetch leave requests
      const { data: leaves } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch payroll records
      const { data: payroll } = await supabase
        .from('payroll')
        .select('*')
        .eq('employee_id', employee.id)
        .order('pay_period_end', { ascending: false })
        .limit(5);

      // Fetch performance reviews
      const { data: reviews } = await supabase
        .from('performance_reviews')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch benefits
      const { data: empBenefits } = await supabase
        .from('employee_benefits')
        .select('*')
        .eq('employee_id', employee.id)
        .eq('status', 'active');

      // Fetch training
      const { data: empTraining } = await supabase
        .from('employee_training')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setLeaveRequests(leaves || []);
      setPayrollRecords(payroll || []);
      setPerformanceReviews(reviews || []);
      setBenefits(empBenefits || []);
      setTraining(empTraining || []);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'probation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'on_leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'terminated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-2 border-blue-500/30">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xl">
                  {employee.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'NA'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-white">{employee.profiles?.full_name}</h2>
                <p className="text-lg text-muted-foreground">{employee.position}</p>
                <p className="text-sm text-muted-foreground">{employee.employee_id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(employee.employment_status)}>
                    {employee.employment_status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    {employee.employment_type.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={onEdit} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span>{employee.profiles?.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span>{employee.profiles?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span>{employee.profiles?.address || 'Not provided'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-400" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>Hired: {new Date(employee.hire_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-yellow-400" />
                  <span>Department: {employee.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Salary: ${employee.salary?.toLocaleString() || 'Not set'}</span>
                </div>
              </CardContent>
            </Card>

            {employee.emergency_contact_name && (
              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-red-400" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{employee.emergency_contact_name}</p>
                    <p className="text-muted-foreground">{employee.emergency_contact_phone}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Account</p>
                  <p>{employee.bank_account || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax ID</p>
                  <p>{employee.tax_id || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leave">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-400" />
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaveRequests.length > 0 ? (
                <div className="space-y-4">
                  {leaveRequests.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div>
                        <p className="font-medium">{leave.leave_type.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{leave.days_requested} days</p>
                      </div>
                      <Badge className={leave.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                                       leave.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                       'bg-yellow-500/20 text-yellow-400'}>
                        {leave.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No leave requests found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                Payroll History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payrollRecords.length > 0 ? (
                <div className="space-y-4">
                  {payrollRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div>
                        <p className="font-medium">
                          {new Date(record.pay_period_start).toLocaleDateString()} - {new Date(record.pay_period_end).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Gross: ${record.gross_pay} | Net: ${record.net_pay}
                        </p>
                      </div>
                      <Badge className={record.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                        {record.payment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No payroll records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Performance Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceReviews.length > 0 ? (
                <div className="space-y-4">
                  {performanceReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">
                          {new Date(review.review_period_start).toLocaleDateString()} - {new Date(review.review_period_end).toLocaleDateString()}
                        </p>
                        <Badge className={review.overall_rating === 'excellent' ? 'bg-green-500/20 text-green-400' :
                                         review.overall_rating === 'good' ? 'bg-blue-500/20 text-blue-400' :
                                         review.overall_rating === 'satisfactory' ? 'bg-yellow-500/20 text-yellow-400' :
                                         'bg-red-500/20 text-red-400'}>
                          {review.overall_rating}
                        </Badge>
                      </div>
                      {review.goals_achieved && (
                        <p className="text-sm text-muted-foreground mt-2">{review.goals_achieved}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No performance reviews found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                Employee Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {benefits.length > 0 ? (
                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit.id} className="p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{benefit.benefit_name}</p>
                          <p className="text-sm text-muted-foreground">{benefit.benefit_type}</p>
                          <p className="text-sm text-muted-foreground">Provider: {benefit.provider || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Coverage: ${benefit.coverage_amount || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">Premium: ${benefit.premium_amount || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No benefits enrolled</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                Training & Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              {training.length > 0 ? (
                <div className="space-y-4">
                  {training.map((course) => (
                    <div key={course.id} className="p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{course.training_name}</p>
                          <p className="text-sm text-muted-foreground">{course.training_type}</p>
                          <p className="text-sm text-muted-foreground">Provider: {course.provider || 'Internal'}</p>
                        </div>
                        <Badge className={course.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                         course.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                         'bg-yellow-500/20 text-yellow-400'}>
                          {course.status}
                        </Badge>
                      </div>
                      {course.certification_earned && (
                        <p className="text-sm text-green-400 mt-2">Certification: {course.certification_earned}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No training records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
