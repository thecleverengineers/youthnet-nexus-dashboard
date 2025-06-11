
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeManagement } from './EmployeeManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { TaskManagement } from './TaskManagement';
import { EmployeeLogin } from './EmployeeLogin';
import { EmployeeDashboard } from './EmployeeDashboard';
import { PayrollManagement } from './PayrollManagement';
import { PerformanceReviews } from './PerformanceReviews';

export const HRAdminTabs = () => {
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('admin');

  useEffect(() => {
    const session = localStorage.getItem('employee_session');
    setIsEmployeeLoggedIn(!!session);
  }, []);

  // Show employee dashboard if logged in as employee
  if (isEmployeeLoggedIn && currentView === 'employee') {
    return <EmployeeDashboard />;
  }

  // Show login screen if trying to access employee view without login
  if (!isEmployeeLoggedIn && currentView === 'employee') {
    return <EmployeeLogin />;
  }

  return (
    <div className="space-y-6">
      {/* View Switcher */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient">HR & Administration</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('admin')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'admin' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'bg-gray-800 text-muted-foreground hover:text-white'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setCurrentView('employee')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'employee' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gray-800 text-muted-foreground hover:text-white'
            }`}
          >
            Employee Portal
          </button>
        </div>
      </div>

      {currentView === 'admin' && (
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceManagement />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskManagement />
          </TabsContent>

          <TabsContent value="payroll">
            <PayrollManagement />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceReviews />
          </TabsContent>

          <TabsContent value="reports">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-white mb-2">Advanced Reports</h3>
              <p className="text-muted-foreground">Comprehensive analytics and reporting dashboard coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
