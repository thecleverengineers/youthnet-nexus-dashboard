
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Building, 
  DollarSign,
  Clock,
  Award,
  FileText,
  Heart,
  GraduationCap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface EmployeeDetailsProps {
  employee: any;
  onClose: () => void;
}

export const EmployeeDetails = ({ employee, onClose }: EmployeeDetailsProps) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeDetails();
  }, [employee.id]);

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch leave requests
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (leaveError) {
        console.error('Error fetching leave requests:', leaveError);
      } else {
        setLeaveRequests(leaveData || []);
      }

      // Fetch employee benefits
      const { data: benefitsData, error: benefitsError } = await supabase
        .from('employee_benefits')
        .select('*')
        .eq('employee_id', employee.id);

      if (benefitsError) {
        console.error('Error fetching benefits:', benefitsError);
      } else {
        setBenefits(benefitsData || []);
      }

      // Fetch employee training
      const { data: trainingData, error: trainingError } = await supabase
        .from('employee_training')
        .select('*')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (trainingError) {
        console.error('Error fetching training:', trainingError);
      } else {
        setTraining(trainingData || []);
      }

    } catch (error) {
      console.error('Error loading employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {employee.profiles?.full_name || 'Unknown Employee'}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-4 w-4" />
                  {employee.position} • {employee.department}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {employee.profiles?.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {employee.profiles?.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  ID: {employee.employee_id}
                </div>
              </div>
              <div className="mt-3">
                <Badge className={getStatusColor(employee.employment_status)}>
                  {employee.employment_status?.replace('_', ' ') || 'Unknown'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="text-white">{employee.profiles?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-white">{employee.profiles?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-white">{employee.profiles?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="text-white">{employee.emergency_contact_name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{employee.emergency_contact_phone || ''}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-400" />
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="text-white">{employee.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="text-white">{employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="text-white">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employment Type</p>
                  <p className="text-white">{employee.employment_type?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hire Date</p>
                  <p className="text-white">
                    {employee.hire_date ? format(new Date(employee.hire_date), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="text-white">
                    {employee.salary ? `$${Number(employee.salary).toLocaleString()}` : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-400" />
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : leaveRequests.length > 0 ? (
                <div className="space-y-3">
                  {leaveRequests.map((leave: any) => (
                    <div key={leave.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white capitalize">
                          {leave.leave_type?.replace('_', ' ')} Leave
                        </h4>
                        <Badge className={getStatusColor(leave.status)}>
                          {leave.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p>Start Date: {format(new Date(leave.start_date), 'MMM dd, yyyy')}</p>
                          <p>End Date: {format(new Date(leave.end_date), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p>Days: {leave.days_requested}</p>
                          <p>Applied: {format(new Date(leave.created_at), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                      {leave.reason && (
                        <p className="mt-2 text-sm text-gray-300">Reason: {leave.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No leave requests found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-400" />
                Employee Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : benefits.length > 0 ? (
                <div className="space-y-3">
                  {benefits.map((benefit: any) => (
                    <div key={benefit.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{benefit.benefit_name}</h4>
                        <Badge className={getStatusColor(benefit.status)}>
                          {benefit.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p>Type: {benefit.benefit_type}</p>
                          <p>Provider: {benefit.provider || 'N/A'}</p>
                        </div>
                        <div>
                          <p>Coverage: ${benefit.coverage_amount || 'N/A'}</p>
                          <p>Premium: ${benefit.premium_amount || 'N/A'}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">
                        Active from {format(new Date(benefit.start_date), 'MMM dd, yyyy')}
                        {benefit.end_date && ` to ${format(new Date(benefit.end_date), 'MMM dd, yyyy')}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No benefits found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-purple-400" />
                Training & Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : training.length > 0 ? (
                <div className="space-y-3">
                  {training.map((course: any) => (
                    <div key={course.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{course.training_name}</h4>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <p>Type: {course.training_type}</p>
                          <p>Provider: {course.provider || 'N/A'}</p>
                        </div>
                        <div>
                          <p>Cost: ${course.cost || 'N/A'}</p>
                          {course.certification_earned && (
                            <p>Certification: {course.certification_earned}</p>
                          )}
                        </div>
                      </div>
                      {course.start_date && (
                        <p className="mt-2 text-sm text-gray-300">
                          {course.start_date && `Started: ${format(new Date(course.start_date), 'MMM dd, yyyy')}`}
                          {course.completion_date && ` • Completed: ${format(new Date(course.completion_date), 'MMM dd, yyyy')}`}
                        </p>
                      )}
                      {course.notes && (
                        <p className="mt-2 text-sm text-gray-300">Notes: {course.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No training records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
