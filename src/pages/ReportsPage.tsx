
import React from 'react';
import { AdvancedReportsAnalytics } from '@/components/hr-admin/AdvancedReportsAnalytics';
import { AIInsightsDashboard } from '@/components/analytics/AIInsightsDashboard';
import { MobilePageHeader } from '@/components/ui/mobile-navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

export const ReportsPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Reports & Analytics"
          subtitle="Data insights dashboard"
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">Comprehensive data insights and reporting</p>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="ai-insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-insights" className="space-y-6">
            <AIInsightsDashboard />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <AdvancedReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
