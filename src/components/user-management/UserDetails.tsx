
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mail, Phone, User, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

interface UserDetailsProps {
  user: Profile;
}

interface UserActivity {
  enrollments: number;
  completedPrograms: number;
  jobApplications: number;
  attendanceRate: number;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  const [activity, setActivity] = useState<UserActivity>({
    enrollments: 0,
    completedPrograms: 0,
    jobApplications: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserActivity();
  }, [user.id]);

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      
      // Get user-specific data based on role
      if (user.role === 'student') {
        // Fetch student enrollments
        const { data: enrollments } = await supabase
          .from('student_enrollments')
          .select('*')
          .eq('student_id', user.id);

        // Fetch job applications
        const { data: applications } = await supabase
          .from('job_applications')
          .select('*')
          .eq('student_id', user.id);

        setActivity({
          enrollments: enrollments?.length || 0,
          completedPrograms: enrollments?.filter(e => e.status === 'completed').length || 0,
          jobApplications: applications?.length || 0,
          attendanceRate: 85, // Mock data for now
        });
      } else if (user.role === 'trainer') {
        // Fetch trainer programs
        const { data: programs } = await supabase
          .from('training_programs')
          .select('*')
          .eq('trainer_id', user.id);

        setActivity({
          enrollments: programs?.length || 0,
          completedPrograms: programs?.filter(p => p.status === 'completed').length || 0,
          jobApplications: 0,
          attendanceRate: 0,
        });
      } else if (user.role === 'staff' || user.role === 'admin') {
        // Fetch employee data
        const { data: employee } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (employee) {
          const { data: tasks } = await supabase
            .from('employee_tasks')
            .select('*')
            .eq('assigned_to', employee.id);

          setActivity({
            enrollments: tasks?.length || 0,
            completedPrograms: tasks?.filter(t => t.status === 'completed').length || 0,
            jobApplications: 0,
            attendanceRate: 92, // Mock data for now
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'staff': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'trainer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'student': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'banned': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{user.full_name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role}
              </Badge>
              <div>
                <p className="text-sm text-gray-500">Role</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{new Date(user.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{activity.enrollments}</p>
                <p className="text-sm text-gray-500">
                  {user.role === 'student' ? 'Enrollments' : 
                   user.role === 'trainer' ? 'Programs' : 'Tasks'}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{activity.completedPrograms}</p>
                <p className="text-sm text-gray-500">
                  {user.role === 'student' ? 'Completed' : 
                   user.role === 'trainer' ? 'Finished' : 'Done'}
                </p>
              </div>

              {user.role === 'student' && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{activity.jobApplications}</p>
                  <p className="text-sm text-gray-500">Applications</p>
                </div>
              )}

              {(user.role === 'student' || user.role === 'staff' || user.role === 'admin') && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{activity.attendanceRate}%</p>
                  <p className="text-sm text-gray-500">Attendance</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Account Status</span>
            <Badge 
              className={user.role === 'banned' ? 
                'bg-red-500/20 text-red-400 border-red-500/30' : 
                'bg-green-500/20 text-green-400 border-green-500/30'
              }
            >
              {user.role === 'banned' ? 'Banned' : 'Active'}
            </Badge>
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-gray-600">
            <p>User ID: {user.id}</p>
            <p>Created: {new Date(user.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(user.updated_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
