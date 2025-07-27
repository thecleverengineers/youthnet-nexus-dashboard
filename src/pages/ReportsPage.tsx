
import React from 'react';
import { AdvancedReportsAnalytics } from '@/components/hr-admin/AdvancedReportsAnalytics';
import { MobilePageHeader } from '@/components/ui/mobile-navigation';
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
        <AdvancedReportsAnalytics />
      </div>
    </div>
  );
};
