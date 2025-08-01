
import React from 'react';
import { GraduationCap, BookOpen, Users, UserCheck, BarChart3, Star } from 'lucide-react';
import { CourseManagement } from '@/components/education-department/CourseManagement';
import { StudentAssignment } from '@/components/education-department/StudentAssignment';
import { InstructorManagement } from '@/components/education-department/InstructorManagement';
import { EducationAnalytics } from '@/components/education-department/EducationAnalytics';
import { PremiumPageHeader } from '@/components/ui/premium-page-header';
import { PremiumTabs } from '@/components/ui/premium-tabs';

export const EducationDepartment = () => {
  const tabs = [
    {
      key: 'courses',
      label: 'Course Management',
      icon: BookOpen,
      content: <CourseManagement />
    },
    {
      key: 'assignments',
      label: 'Student Assignment',
      icon: UserCheck,
      content: <StudentAssignment />
    },
    {
      key: 'instructors',
      label: 'Instructors',
      icon: Users,
      content: <InstructorManagement />
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      content: <EducationAnalytics />
    }
  ];

  const badges = [
    { label: 'Department System', icon: Star },
    { label: 'Academic Management', variant: 'secondary' as const }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PremiumPageHeader
        title="Education Department"
        subtitle="Manage courses, instructors, and student assignments"
        icon={GraduationCap}
        badges={badges}
      />

      <PremiumTabs tabs={tabs} defaultValue="courses" />
    </div>
  );
};
