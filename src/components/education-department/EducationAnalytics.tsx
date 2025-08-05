
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { useEducationAnalytics } from '@/hooks/useEducationAnalytics';

export const EducationAnalytics = () => {
  const { enrollmentTrends, performanceStats, programPopularity, loading } = useEducationAnalytics();

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Education Analytics</CardTitle>
          <CardDescription>View insights and performance metrics for educational programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading analytics data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <div className="text-2xl font-bold mt-2">{performanceStats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Active Enrollments</span>
            </div>
            <div className="text-2xl font-bold mt-2">{performanceStats.activeEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Completed Programs</span>
            </div>
            <div className="text-2xl font-bold mt-2">{performanceStats.completedPrograms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <div className="text-2xl font-bold mt-2">{performanceStats.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Trends</CardTitle>
          <CardDescription>Monthly enrollment and completion trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="enrollments" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Enrollments"
              />
              <Line 
                type="monotone" 
                dataKey="completions" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Completions"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Program Popularity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Program Enrollments</CardTitle>
            <CardDescription>Popular training programs by enrollment count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={programPopularity.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrollments" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rates by Program</CardTitle>
            <CardDescription>Success rates across different programs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={programPopularity.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="completionRate"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {programPopularity.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
