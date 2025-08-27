
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AttendanceManagement } from './AttendanceManagement';
import { PayrollManagement } from './PayrollManagement';
import { PerformanceReviews } from './PerformanceReviews';
import { TaskManagement } from './TaskManagement';
import { AdvancedPayrollManagement } from './AdvancedPayrollManagement';
import { AdvancedPerformanceReviews } from './AdvancedPerformanceReviews';
import { AdvancedTaskManagement } from './AdvancedTaskManagement';
import { AdvancedReportsAnalytics } from './AdvancedReportsAnalytics';
import { StaffDataImport } from './StaffDataImport';
import { StudentManagement } from '@/components/people/StudentManagement';
import { TrainerManagement } from '@/components/people/TrainerManagement';
import { StaffManagement } from '@/components/people/StaffManagement';

export const HRAdminTabs = () => {
  const [activeTab,] = useState('employees');

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          HR & People Management
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive human resource and people management system</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="advanced-payroll">Advanced Payroll</TabsTrigger>
            <TabsTrigger value="advanced-reviews">Advanced Reviews</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="students" className="space-y-6">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="trainers" className="space-y-6">
          <TrainerManagement />
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <StaffManagement />
        </TabsContent>


        <TabsContent value="import" className="space-y-6">
          <StaffDataImport />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <AttendanceManagement />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <PayrollManagement />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <PerformanceReviews />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TaskManagement />
        </TabsContent>

        <TabsContent value="advanced-payroll" className="space-y-6">
          <AdvancedPayrollManagement />
        </TabsContent>

        <TabsContent value="advanced-reviews" className="space-y-6">
          <AdvancedPerformanceReviews />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdvancedReportsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
