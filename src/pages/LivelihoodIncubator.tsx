
import React, { useState } from 'react';
import { Lightbulb, Users, Target, Heart } from 'lucide-react';
import { ProgramManagement } from '@/components/livelihood/ProgramManagement';
import { ParticipantTracker } from '@/components/livelihood/ParticipantTracker';
import { OutcomeAssessment } from '@/components/livelihood/OutcomeAssessment';
import { CommunityImpact } from '@/components/livelihood/CommunityImpact';
import { MobilePageHeader, MobileTabBar } from '@/components/ui/mobile-navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const LivelihoodIncubator = () => {
  const [activeTab, setActiveTab] = useState('programs');
  const isMobile = useIsMobile();

  const tabs = [
    { key: 'programs', label: 'Programs', icon: <Lightbulb className="h-4 w-4" /> },
    { key: 'participants', label: 'Participants', icon: <Users className="h-4 w-4" /> },
    { key: 'outcomes', label: 'Outcomes', icon: <Target className="h-4 w-4" /> },
    { key: 'impact', label: 'Impact', icon: <Heart className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Livelihood Incubator"
          subtitle="Community development programs"
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold">Livelihood Incubator</h1>
          <p className="text-muted-foreground mt-2">Manage livelihood programs and community development</p>
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
        {activeTab === 'programs' && <ProgramManagement />}
        {activeTab === 'participants' && <ParticipantTracker />}
        {activeTab === 'outcomes' && <OutcomeAssessment />}
        {activeTab === 'impact' && <CommunityImpact />}
      </div>
    </div>
  );
};
