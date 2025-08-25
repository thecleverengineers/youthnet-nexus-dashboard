import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';

const queryClient = new QueryClient();

import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute';
import { Dashboard } from '@/pages/Dashboard';
import Index from '@/pages/Index';
import { Education } from '@/pages/Education';
import { SkillDevelopment } from '@/pages/SkillDevelopment';
import { JobCentre } from '@/pages/JobCentre';
import { CareerCentre } from '@/pages/CareerCentre';
import { EducationDepartment } from '@/pages/EducationDepartment';
import { Incubation } from '@/pages/Incubation';
import { MadeInNagaland } from '@/pages/MadeInNagaland';
import { LivelihoodIncubator } from '@/pages/LivelihoodIncubator';
import { Environment } from '@/pages/Environment';
import { PeopleManagement } from '@/pages/PeopleManagement';
import { HRAdmin } from '@/pages/HRAdmin';
import { Inventory } from '@/pages/Inventory';
import { ReportsPage } from '@/pages/ReportsPage';
import { Settings } from '@/pages/Settings';
import { AuthPage } from '@/components/auth/AuthPage';
import { AuthenticationManagement } from '@/pages/AuthenticationManagement';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="youthnet-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RoleBasedRoute />} />
              <Route path="/dashboard" element={<RoleBasedRoute />} />
              <Route path="/education" element={
                <ProtectedRoute>
                  <Layout>
                    <Education />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/education-department" element={
                <ProtectedRoute>
                  <Layout>
                    <EducationDepartment />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/skill-development" element={
                <ProtectedRoute>
                  <Layout>
                    <SkillDevelopment />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/job-centre" element={
                <ProtectedRoute>
                  <Layout>
                    <JobCentre />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/career-centre" element={
                <ProtectedRoute>
                  <Layout>
                    <CareerCentre />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/incubation" element={
                <ProtectedRoute>
                  <Layout>
                    <Incubation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/made-in-nagaland" element={
                <ProtectedRoute>
                  <Layout>
                    <MadeInNagaland />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/livelihood-incubator" element={
                <ProtectedRoute>
                  <Layout>
                    <LivelihoodIncubator />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/environment" element={
                <ProtectedRoute>
                  <Layout>
                    <Environment />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/people" element={
                <ProtectedRoute>
                  <Layout>
                    <PeopleManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/hr-admin" element={
                <ProtectedRoute>
                  <Layout>
                    <HRAdmin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <Layout>
                    <Inventory />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/authentication" element={
                <ProtectedRoute>
                  <Layout>
                    <AuthenticationManagement />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/index" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
