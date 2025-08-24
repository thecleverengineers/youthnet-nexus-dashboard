
import React from 'react';
import { HRAdminTabs } from '@/components/hr-admin/HRAdminTabs';
import { QuickStaffImport } from '@/components/hr-admin/QuickStaffImport';

export const HRAdmin = () => {
  return (
    <div className="container mx-auto p-6">
      <QuickStaffImport />
      <HRAdminTabs />
    </div>
  );
};
