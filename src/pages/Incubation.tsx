
import React, { useState } from 'react';
import { FileText, Lightbulb, UserCheck, DollarSign } from 'lucide-react';
import { StartupApplications } from '@/components/incubation/StartupApplications';
import { IncubationPrograms } from '@/components/incubation/IncubationPrograms';
import { MentorshipManagement } from '@/components/incubation/MentorshipManagement';
import { FundingTracker } from '@/components/incubation/FundingTracker';
import { MobilePageHeader, MobileTabBar } from '@/components/ui/mobile-navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const Incubation = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const isMobile = useIsMobile();

  const tabs = [
    { key: 'applications', label: 'Applications', icon: <FileText className="h-4 w-4" /> },
    { key: 'programs', label: 'Programs', icon: <Lightbulb className="h-4 w-4" /> },
    { key: 'mentorship', label: 'Mentorship', icon: <UserCheck className="h-4 w-4" /> },
    { key: 'funding', label: 'Funding', icon: <DollarSign className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Incubation Center"
          subtitle="Startup programs & funding"
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold">Incubation Center</h1>
          <p className="text-muted-foreground mt-2">Manage startup applications and incubation programs</p>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="sticky top-16 z-20 bg-background border-b border-border p-4">
          <MobileTabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
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
        {activeTab === 'applications' && <StartupApplications />}
        {activeTab === 'programs' && <IncubationPrograms />}
        {activeTab === 'mentorship' && <MentorshipManagement />}
        {activeTab === 'funding' && <FundingTracker />}
      </div>
    </div>
  );
};
