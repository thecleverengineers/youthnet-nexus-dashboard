
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Target,
  Plus,
  Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SkillAssessment } from '@/components/skill-development/SkillAssessment';
import { TrainingPlans } from '@/components/skill-development/TrainingPlans';
import { CertificationTracking } from '@/components/skill-development/CertificationTracking';
import { SkillAnalytics } from '@/components/skill-development/SkillAnalytics';

export function SkillDevelopment() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['skill-development-stats'],
    queryFn: async () => {
      const [skillAssessmentsRes, certificationsRes, activeTrainingsRes] = await Promise.all([
        supabase.from('employee_training').select('*', { count: 'exact', head: true }),
        supabase.from('employee_training').select('*', { count: 'exact', head: true }).eq('certification_earned', true),
        supabase.from('employee_training').select('*', { count: 'exact', head: true }).eq('status', 'enrolled')
      ]);

      return {
        totalAssessments: skillAssessmentsRes.count || 0,
        completedCertifications: certificationsRes.count || 0,
        activeTrainings: activeTrainingsRes.count || 0,
        skillCompletionRate: 87
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
          <h1 className="text-3xl font-bold">Skill Development Centre</h1>
          <p className="text-muted-foreground">Comprehensive skill assessment and development platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Assessments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssessments || 0}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedCertifications || 0}</div>
            <p className="text-xs text-muted-foreground">
              +8 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trainings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeTrainings || 0}</div>
            <p className="text-xs text-muted-foreground">
              5 programs running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.skillCompletionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +3% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="training-plans">Training Plans</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillAssessment />
            <SkillAnalytics />
          </div>
        </TabsContent>

        <TabsContent value="assessments">
          <SkillAssessment detailed={true} />
        </TabsContent>

        <TabsContent value="training-plans">
          <TrainingPlans />
        </TabsContent>

        <TabsContent value="certifications">
          <CertificationTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
}
