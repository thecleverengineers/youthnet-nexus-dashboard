
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeManagement } from '@/components/hr-admin/EmployeeManagement';
import { AttendanceTracker } from '@/components/hr-admin/AttendanceTracker';
import { PayrollManagement } from '@/components/hr-admin/PayrollManagement';
import { PerformanceReviews } from '@/components/hr-admin/PerformanceReviews';

export const HRAdmin = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">HR & Administration</h1>
        <p className="text-gray-600 mt-2">Manage employees, attendance, and administrative tasks</p>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTracker />
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollManagement />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceReviews />
        </TabsContent>
      </Tabs>
    </div>
  );
};
