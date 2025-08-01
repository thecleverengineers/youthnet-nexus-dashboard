
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumPageHeader } from '@/components/ui/premium-page-header';
import { PremiumStatsGrid, PremiumStatsCard } from '@/components/ui/premium-stats-grid';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  Target,
  Plus,
  Download,
  Heart,
  Star
} from 'lucide-react';
import { CareerCounselling } from '@/components/career-centre/CareerCounselling';
import { MentorshipPrograms } from '@/components/career-centre/MentorshipPrograms';
import { CareerResources } from '@/components/career-centre/CareerResources';
import { CareerAnalytics } from '@/components/career-centre/CareerAnalytics';

export function CareerCentre() {
  const [activeTab, setActiveTab] = useState('overview');

  const badges = [
    { label: 'Career Guidance', icon: Heart },
    { label: 'Mentorship Hub', variant: 'secondary' as const, icon: Star }
  ];

  const headerActions = (
    <>
      <Button variant="outline" size="sm" className="premium-button">
        <Download className="h-4 w-4 mr-2" />
        Export Reports
      </Button>
      <Button size="sm" className="premium-button">
        <Plus className="h-4 w-4 mr-2" />
        New Session
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PremiumPageHeader
        title="Career Development Centre"
        subtitle="Comprehensive career guidance and mentorship services"
        icon={Heart}
        badges={badges}
        actions={headerActions}
      />

      {/* Statistics Cards */}
      <PremiumStatsGrid columns={4}>
        <PremiumStatsCard
          title="Counselling Sessions"
          value={156}
          change={{ value: '+22% from last month', type: 'increase' }}
          icon={MessageSquare}
        />
        <PremiumStatsCard
          title="Active Mentees"
          value={89}
          change={{ value: '12 new this month', type: 'increase' }}
          icon={Users}
        />
        <PremiumStatsCard
          title="Resources Accessed"
          value="2,847"
          change={{ value: '+35% engagement', type: 'increase' }}
          icon={BookOpen}
        />
        <PremiumStatsCard
          title="Career Goals Met"
          value="73%"
          change={{ value: '+8% success rate', type: 'increase' }}
          icon={Target}
        />
      </PremiumStatsGrid>

      {/* Main Content Tabs */}
      <div className="premium-card border-0 bg-gradient-to-r from-background to-primary/5 p-1 rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-4">
            <TabsTrigger value="overview" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="counselling" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Counselling
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Mentorship
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-primary/10 rounded-lg">
              Resources
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6 fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CareerCounselling />
                <MentorshipPrograms />
              </div>
            </TabsContent>

            <TabsContent value="counselling" className="fade-in">
              <CareerCounselling detailed={true} />
            </TabsContent>

            <TabsContent value="mentorship" className="fade-in">
              <MentorshipPrograms detailed={true} />
            </TabsContent>

            <TabsContent value="resources" className="fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CareerResources />
                <CareerAnalytics />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
