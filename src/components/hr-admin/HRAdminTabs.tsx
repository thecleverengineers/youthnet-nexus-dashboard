
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
        {/* Mobile-Optimized Navigation */}
        <div className="mb-6">
          {/* Mobile: Dropdown Navigation */}
          <div className="block md:hidden">
            <TabsList className="w-full h-auto p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="grid grid-cols-2 gap-1 w-full">
                <TabsTrigger value="employees" className="px-3 py-2 text-xs font-medium">👥 Staff</TabsTrigger>
                <TabsTrigger value="users" className="px-3 py-2 text-xs font-medium">⚙️ Users</TabsTrigger>
                <TabsTrigger value="attendance" className="px-3 py-2 text-xs font-medium">📊 Attend</TabsTrigger>
                <TabsTrigger value="payroll" className="px-3 py-2 text-xs font-medium">💰 Pay</TabsTrigger>
                <TabsTrigger value="reviews" className="px-3 py-2 text-xs font-medium">⭐ Reviews</TabsTrigger>
                <TabsTrigger value="tasks" className="px-3 py-2 text-xs font-medium">✅ Tasks</TabsTrigger>
                <TabsTrigger value="templates" className="px-3 py-2 text-xs font-medium">📋 Templates</TabsTrigger>
                <TabsTrigger value="import" className="px-3 py-2 text-xs font-medium">📥 Import</TabsTrigger>
                <TabsTrigger value="advanced-payroll" className="px-3 py-2 text-xs font-medium">💰+ Adv Pay</TabsTrigger>
                <TabsTrigger value="advanced-reviews" className="px-3 py-2 text-xs font-medium">⭐+ Adv Rev</TabsTrigger>
                <TabsTrigger value="advanced-tasks" className="px-3 py-2 text-xs font-medium">✅+ Adv Task</TabsTrigger>
                <TabsTrigger value="reports" className="px-3 py-2 text-xs font-medium">📈 Reports</TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* Desktop: Horizontal Tabs */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 h-12 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              <TabsTrigger value="employees" className="text-sm font-medium">👥 Employees</TabsTrigger>
              <TabsTrigger value="users" className="text-sm font-medium">⚙️ Users</TabsTrigger>
              <TabsTrigger value="templates" className="text-sm font-medium">📋 Templates</TabsTrigger>
              <TabsTrigger value="import" className="text-sm font-medium">📥 Import</TabsTrigger>
              <TabsTrigger value="attendance" className="text-sm font-medium">📊 Attendance</TabsTrigger>
              <TabsTrigger value="payroll" className="text-sm font-medium">💰 Payroll</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm font-medium">⭐ Reviews</TabsTrigger>
              <TabsTrigger value="tasks" className="text-sm font-medium">✅ Tasks</TabsTrigger>
              <TabsTrigger value="advanced-payroll" className="text-sm font-medium">💰+ Adv Payroll</TabsTrigger>
              <TabsTrigger value="advanced-reviews" className="text-sm font-medium">⭐+ Adv Reviews</TabsTrigger>
              <TabsTrigger value="advanced-tasks" className="text-sm font-medium">✅+ Adv Tasks</TabsTrigger>
              <TabsTrigger value="reports" className="text-sm font-medium">📈 Reports</TabsTrigger>
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

        <TabsContent value="reports" className="space-y-6">
          <AdvancedReportsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
