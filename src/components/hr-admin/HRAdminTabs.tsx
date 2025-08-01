
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

      <div className="premium-card border-0 bg-gradient-to-r from-background to-primary/5 p-1 rounded-xl">
        <Tabs defaultValue="employees" className="w-full">
          {/* Mobile-Optimized Navigation */}
          <div className="mb-6">
            {/* Mobile: Dropdown Navigation */}
            <div className="block md:hidden">
              <TabsList className="w-full h-auto p-1 bg-transparent">
                <div className="grid grid-cols-2 gap-1 w-full">
                  <TabsTrigger value="employees" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">👥 Staff</TabsTrigger>
                  <TabsTrigger value="users" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">⚙️ Users</TabsTrigger>
                  <TabsTrigger value="attendance" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📊 Attend</TabsTrigger>
                  <TabsTrigger value="payroll" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">💰 Pay</TabsTrigger>
                  <TabsTrigger value="reviews" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">⭐ Reviews</TabsTrigger>
                  <TabsTrigger value="tasks" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">✅ Tasks</TabsTrigger>
                  <TabsTrigger value="templates" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📋 Templates</TabsTrigger>
                  <TabsTrigger value="import" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📥 Import</TabsTrigger>
                  <TabsTrigger value="advanced-payroll" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">💰+ Adv Pay</TabsTrigger>
                  <TabsTrigger value="advanced-reviews" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">⭐+ Adv Rev</TabsTrigger>
                  <TabsTrigger value="advanced-tasks" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">✅+ Adv Task</TabsTrigger>
                  <TabsTrigger value="reports" className="px-3 py-2 text-xs font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📈 Reports</TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Desktop: Horizontal Tabs */}
            <div className="hidden md:block">
              <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 h-12 p-1 bg-transparent">
                <TabsTrigger value="employees" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">👥 Employees</TabsTrigger>
                <TabsTrigger value="users" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">⚙️ Users</TabsTrigger>
                <TabsTrigger value="templates" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📋 Templates</TabsTrigger>
                <TabsTrigger value="import" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📥 Import</TabsTrigger>
                <TabsTrigger value="attendance" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📊 Attendance</TabsTrigger>
                <TabsTrigger value="payroll" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">💰 Payroll</TabsTrigger>
                <TabsTrigger value="reviews" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">⭐ Reviews</TabsTrigger>
                <TabsTrigger value="tasks" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">✅ Tasks</TabsTrigger>
                <TabsTrigger value="advanced-payroll" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">💰+ Adv Payroll</TabsTrigger>
                <TabsTrigger value="advanced-reviews" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">⭐+ Adv Reviews</TabsTrigger>
                <TabsTrigger value="advanced-tasks" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">✅+ Adv Tasks</TabsTrigger>
                <TabsTrigger value="reports" className="text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white hover:bg-primary/10 rounded-lg">📈 Reports</TabsTrigger>
              </TabsList>
            </div>
          </div>

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

          <TabsContent value="reports" className="space-y-6 fade-in">
            <AdvancedReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
