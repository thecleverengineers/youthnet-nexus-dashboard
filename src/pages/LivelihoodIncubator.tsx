
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgramManagement } from '@/components/livelihood/ProgramManagement';
import { ParticipantTracker } from '@/components/livelihood/ParticipantTracker';
import { OutcomeAssessment } from '@/components/livelihood/OutcomeAssessment';
import { CommunityImpact } from '@/components/livelihood/CommunityImpact';

export const LivelihoodIncubator = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Livelihood Incubator</h1>
        <p className="text-gray-600 mt-2">Manage livelihood programs and community development</p>
      </div>

      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="impact">Community Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <ProgramManagement />
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantTracker />
        </TabsContent>

        <TabsContent value="outcomes">
          <OutcomeAssessment />
        </TabsContent>

        <TabsContent value="impact">
          <CommunityImpact />
        </TabsContent>
      </Tabs>
    </div>
  );
};
