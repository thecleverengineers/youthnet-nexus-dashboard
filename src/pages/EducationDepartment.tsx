
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseManagement } from '@/components/education-department/CourseManagement';
import { StudentAssignment } from '@/components/education-department/StudentAssignment';
import { InstructorManagement } from '@/components/education-department/InstructorManagement';
import { EducationAnalytics } from '@/components/education-department/EducationAnalytics';

export const EducationDepartment = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Education Department</h1>
        <p className="text-gray-600 mt-2">Manage courses, instructors, and student assignments</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Course Management</TabsTrigger>
          <TabsTrigger value="assignments">Student Assignment</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>

        <TabsContent value="assignments">
          <StudentAssignment />
        </TabsContent>

        <TabsContent value="instructors">
          <InstructorManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <EducationAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
