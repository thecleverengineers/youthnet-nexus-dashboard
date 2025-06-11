
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StartupApplications } from '@/components/incubation/StartupApplications';
import { IncubationPrograms } from '@/components/incubation/IncubationPrograms';
import { MentorshipManagement } from '@/components/incubation/MentorshipManagement';
import { FundingTracker } from '@/components/incubation/FundingTracker';

export const Incubation = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Incubation Center</h1>
        <p className="text-gray-600 mt-2">Manage startup applications and incubation programs</p>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
          <TabsTrigger value="funding">Funding</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <StartupApplications />
        </TabsContent>

        <TabsContent value="programs">
          <IncubationPrograms />
        </TabsContent>

        <TabsContent value="mentorship">
          <MentorshipManagement />
        </TabsContent>

        <TabsContent value="funding">
          <FundingTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};
