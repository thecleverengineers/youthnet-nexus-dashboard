
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Download,
  BookOpen,
  Award,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StudentManagement } from '@/components/education/StudentManagement';
import { ProgramManagement } from '@/components/education/ProgramManagement';
import { EnrollmentManagement } from '@/components/education/EnrollmentManagement';
import { PerformanceAnalytics } from '@/components/education/PerformanceAnalytics';

export function Education() {
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch education statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['education-stats'],
    queryFn: async () => {
      const [studentsRes, programsRes, enrollmentsRes, completionsRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }),
        supabase.from('student_enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('student_enrollments').select('*', { count: 'exact', head: true }).eq('status', 'completed')
      ]);

      return {
        totalStudents: studentsRes.count || 0,
        totalPrograms: programsRes.count || 0,
        activeEnrollments: enrollmentsRes.count || 0,
        completions: completionsRes.count || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Education Department</h1>
          <p className="text-muted-foreground">Comprehensive education management system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPrograms || 0}</div>
            <p className="text-xs text-muted-foreground">
              3 new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeEnrollments || 0}</div>
            <p className="text-xs text-muted-foreground">
              85% capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completions || 0}</div>
            <p className="text-xs text-muted-foreground">
              92% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnrollmentManagement />
            <PerformanceAnalytics />
          </div>
        </TabsContent>

        <TabsContent value="students">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="programs">
          <ProgramManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <PerformanceAnalytics detailed={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
