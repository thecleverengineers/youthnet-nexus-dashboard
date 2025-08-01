
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumPageHeader } from '@/components/ui/premium-page-header';
import { PremiumStatsGrid, PremiumStatsCard } from '@/components/ui/premium-stats-grid';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  FileText,
  Plus,
  Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobPostings } from '@/components/job-centre/JobPostings';
import { ApplicationTracking } from '@/components/job-centre/ApplicationTracking';
import { PlacementAnalytics } from '@/components/job-centre/PlacementAnalytics';
import { EmployerManagement } from '@/components/job-centre/EmployerManagement';

export function JobCentre() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['job-centre-stats'],
    queryFn: async () => {
      const [jobPostingsRes, applicationsRes, placementsRes, employersRes] = await Promise.all([
        supabase.from('job_postings').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('status', 'selected'),
        supabase.from('job_postings').select('company', { count: 'exact', head: true })
      ]);

      return {
        totalJobs: jobPostingsRes.count || 0,
        totalApplications: applicationsRes.count || 0,
        successfulPlacements: placementsRes.count || 0,
        activeEmployers: employersRes.count || 0
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

  const badges = [
    { label: 'Career Services', icon: Briefcase },
    { label: 'Placement System', variant: 'secondary' as const }
  ];

  const headerActions = (
    <>
      <Button variant="outline" size="sm" className="premium-button">
        <Download className="h-4 w-4 mr-2" />
        Export Reports
      </Button>
      <Button size="sm" className="premium-button">
        <Plus className="h-4 w-4 mr-2" />
        New Job Posting
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PremiumPageHeader
        title="Job Centre"
        subtitle="Comprehensive job placement and career services"
        icon={Briefcase}
        badges={badges}
        actions={headerActions}
      />

      {/* Statistics Cards */}
      <PremiumStatsGrid columns={4}>
        <PremiumStatsCard
          title="Total Jobs"
          value={stats?.totalJobs || 0}
          change={{ value: '+12% from last month', type: 'increase' }}
          icon={Briefcase}
        />
        <PremiumStatsCard
          title="Applications"
          value={stats?.totalApplications || 0}
          change={{ value: '+25% from last month', type: 'increase' }}
          icon={FileText}
        />
        <PremiumStatsCard
          title="Placements"
          value={stats?.successfulPlacements || 0}
          change={{ value: '+18% success rate', type: 'increase' }}
          icon={TrendingUp}
        />
        <PremiumStatsCard
          title="Active Employers"
          value={stats?.activeEmployers || 0}
          change={{ value: '5 new this month', type: 'neutral' }}
          icon={Users}
        />
      </PremiumStatsGrid>

      {/* Main Content Tabs */}
      <div className="premium-card border-0 bg-gradient-to-r from-background to-primary/5 p-1 rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-4">
            <TabsTrigger value="overview" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="job-postings" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Job Postings
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Applications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6 fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <JobPostings />
                <ApplicationTracking />
              </div>
            </TabsContent>

            <TabsContent value="job-postings" className="fade-in">
              <JobPostings detailed={true} />
            </TabsContent>

            <TabsContent value="applications" className="fade-in">
              <ApplicationTracking detailed={true} />
            </TabsContent>

            <TabsContent value="analytics" className="fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PlacementAnalytics />
                <EmployerManagement />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
