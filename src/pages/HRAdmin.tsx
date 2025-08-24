
import React from 'react';
import { HRAdminTabs } from '@/components/hr-admin/HRAdminTabs';
import { StaffDataImport } from '@/components/hr-admin/StaffDataImport';

export const HRAdmin = () => {
  return (
    <div className="container mx-auto p-6">
      <StaffDataImport />
      <HRAdminTabs />
    </div>
  );
};
