
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Award, TrendingUp, Target, Plus, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SkillAssessment } from '@/components/skill-development/SkillAssessment';
import { TrainingPlans } from '@/components/skill-development/TrainingPlans';
import { CertificationTracking } from '@/components/skill-development/CertificationTracking';
import { SkillAnalytics } from '@/components/skill-development/SkillAnalytics';
import { MobilePageHeader, MobileTabBar, MobileFloatingActionButton } from '@/components/ui/mobile-navigation';
import { MobileStatsGrid, MobileStatsCard } from '@/components/ui/mobile-stats';
import { PremiumPageHeader } from '@/components/ui/premium-page-header';
import { useIsMobile } from '@/hooks/use-mobile';

export function SkillDevelopment() {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['skill-development-stats'],
    queryFn: async () => {
      const [skillAssessmentsRes, certificationsRes, activeTrainingsRes] = await Promise.all([
        supabase.from('skill_assessments').select('*', { count: 'exact', head: true }),
        supabase.from('certifications').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('training_programs').select('*', { count: 'exact', head: true }).eq('status', 'active')
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

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <Target className="h-4 w-4" /> },
    { key: 'assessments', label: 'Assessments', icon: <Award className="h-4 w-4" /> },
    { key: 'training-plans', label: 'Training', icon: <Users className="h-4 w-4" /> },
    { key: 'certifications', label: 'Certificates', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Skill Development"
          subtitle="Assessment & development platform"
          actions={
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          }
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6">
          <PremiumPageHeader
            title="Skill Development Centre"
            subtitle="Comprehensive skill assessment and development platform"
            icon={Target}
            badges={[
              { label: 'Assessment Hub', icon: Award },
              { label: 'Development Center', variant: 'secondary' as const }
            ]}
            actions={
              <>
                <Button variant="outline" size="sm" className="premium-button">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
                <Button size="sm" className="premium-button">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </>
            }
          />
        </div>
      )}

      {/* Statistics Cards */}
      <div className="p-4">
        <MobileStatsGrid columns={isMobile ? 2 : 4}>
          <MobileStatsCard
            title="Skill Assessments"
            value={stats?.totalAssessments || 0}
            change={{ value: '+15%', type: 'increase' }}
            icon={Target}
          />
          <MobileStatsCard
            title="Certifications"
            value={stats?.completedCertifications || 0}
            change={{ value: '+8 this month', type: 'increase' }}
            icon={Award}
          />
          <MobileStatsCard
            title="Active Trainings"
            value={stats?.activeTrainings || 0}
            change={{ value: '5 programs', type: 'neutral' }}
            icon={Users}
          />
          <MobileStatsCard
            title="Completion Rate"
            value={`${stats?.skillCompletionRate || 0}%`}
            change={{ value: '+3%', type: 'increase' }}
            icon={TrendingUp}
          />
        </MobileStatsGrid>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="sticky top-16 z-20 bg-background border-b border-border p-4">
          <MobileTabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="minimal"
          />
        </div>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="px-6">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillAssessment />
            <SkillAnalytics />
          </div>
        )}

        {activeTab === 'assessments' && (
          <SkillAssessment detailed={true} />
        )}

        {activeTab === 'training-plans' && (
          <TrainingPlans />
        )}

        {activeTab === 'certifications' && (
          <CertificationTracking />
        )}
      </div>

      {/* Mobile FAB */}
      {isMobile && (
        <MobileFloatingActionButton
          onClick={() => {/* Handle new assessment */}}
          icon={<Plus className="h-5 w-5" />}
          label="New Assessment"
        />
      )}
    </div>
  );
}
