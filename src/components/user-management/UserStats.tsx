
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, Crown, GraduationCap, Briefcase, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  total: number;
  admins: number;
  staff: number;
  trainers: number;
  students: number;
  banned: number;
  activeToday: number;
  newThisMonth: number;
}

export const UserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    admins: 0,
    staff: 0,
    trainers: 0,
    students: 0,
    banned: 0,
    activeToday: 0,
    newThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      
      // Get all users
      const { data: users, error } = await supabase
        .from('profiles')
        .select('role, created_at');

      if (error) throw error;

      if (users) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats: UserStats = {
          total: users.length,
          admins: users.filter(u => u.role === 'admin').length,
          staff: users.filter(u => u.role === 'staff').length,
          trainers: users.filter(u => u.role === 'trainer').length,
          students: users.filter(u => u.role === 'student').length,
          banned: users.filter(u => u.role === 'banned').length,
          activeToday: Math.floor(users.length * 0.15), // Mock data - 15% active today
          newThisMonth: users.filter(u => new Date(u.created_at) >= firstDayOfMonth).length,
        };

        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Administrators',
      value: stats.admins,
      icon: Crown,
      color: 'text-red-600',
      bgColor: 'bg-red-500/20',
    },
    {
      title: 'Staff Members',
      value: stats.staff,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Trainers',
      value: stats.trainers,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Students',
      value: stats.students,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Banned Users',
      value: stats.banned,
      icon: UserX,
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/20',
    },
    {
      title: 'Active Today',
      value: stats.activeToday,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'New This Month',
      value: stats.newThisMonth,
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/20',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Students
                </Badge>
                <span className="text-sm text-gray-600">{stats.students} users</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(stats.students / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Trainers
                </Badge>
                <span className="text-sm text-gray-600">{stats.trainers} users</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(stats.trainers / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Staff
                </Badge>
                <span className="text-sm text-gray-600">{stats.staff} users</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(stats.staff / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  Admins
                </Badge>
                <span className="text-sm text-gray-600">{stats.admins} users</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(stats.admins / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
