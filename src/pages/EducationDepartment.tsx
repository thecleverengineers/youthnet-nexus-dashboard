
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseManagement } from '@/components/education-department/CourseManagement';
import { StudentAssignment } from '@/components/education-department/StudentAssignment';
import { InstructorManagement } from '@/components/education-department/InstructorManagement';
import { EducationAnalytics } from '@/components/education-department/EducationAnalytics';
import { StudentManagement } from '@/components/people/StudentManagement';
import { TrainerManagement } from '@/components/people/TrainerManagement';

export const EducationDepartment = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Education Department</h1>
        <p className="text-gray-600 mt-2">Manage courses, instructors, and student assignments</p>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="assignments">Student Assignment</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="students">
          <StudentManagement />
        </TabsContent>

        <TabsContent value="trainers">
          <TrainerManagement />
        </TabsContent>

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
