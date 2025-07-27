
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeManagement } from './EmployeeManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { PayrollManagement } from './PayrollManagement';
import { PerformanceReviews } from './PerformanceReviews';
import { TaskManagement } from './TaskManagement';
import { AdvancedPayrollManagement } from './AdvancedPayrollManagement';
import { AdvancedPerformanceReviews } from './AdvancedPerformanceReviews';
import { AdvancedTaskManagement } from './AdvancedTaskManagement';
import { AdvancedReportsAnalytics } from './AdvancedReportsAnalytics';
import { StaffDataImport } from './StaffDataImport';
import { StaffTemplateManagement } from './StaffTemplateManagement';
import { UserManagement } from '@/components/user-management/UserManagement';

export const HRAdminTabs = () => {
  const [activeTab,] = useState('employees');

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          HR Administration
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive human resource management system</p>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="templates">Staff Templates</TabsTrigger>
          <TabsTrigger value="import">Import Staff</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="advanced-payroll">Advanced Payroll</TabsTrigger>
          <TabsTrigger value="advanced-reviews">Advanced Reviews</TabsTrigger>
          <TabsTrigger value="advanced-tasks">Advanced Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <EmployeeManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <StaffTemplateManagement />
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

        <TabsContent value="advanced-tasks" className="space-y-6">
          <AdvancedTaskManagement />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <AdvancedReportsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
