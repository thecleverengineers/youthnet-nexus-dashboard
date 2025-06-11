
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { AnalyticsDashboard } from '@/components/reports/AnalyticsDashboard';
import { ExportCenter } from '@/components/reports/ExportCenter';
import { ScheduledReports } from '@/components/reports/ScheduledReports';

export const ReportsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate insights and export data across all departments</p>
      </div>

      <Tabs defaultValue="generator" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export Center</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="export">
          <ExportCenter />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
