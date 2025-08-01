
import React from 'react';
import { Users, Star, Shield } from 'lucide-react';
import { HRAdminTabs } from '@/components/hr-admin/HRAdminTabs';
import { PremiumPageHeader } from '@/components/ui/premium-page-header';

export const HRAdmin = () => {
  const badges = [
    { label: 'HR System', icon: Star },
    { label: 'Admin Access', variant: 'secondary' as const, icon: Shield }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PremiumPageHeader
        title="HR Administration"
        subtitle="Comprehensive human resource management system"
        icon={Users}
        badges={badges}
      />
      
      <div className="premium-card border-0 bg-gradient-to-br from-background to-primary/5 p-6">
        <HRAdminTabs />
      </div>
    </div>
  );
};
