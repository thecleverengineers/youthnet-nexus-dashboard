
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { MongoAuthProvider } from '@/hooks/useMongoAuth';
import { PHPAuthProvider } from '@/hooks/usePHPAuth';
import { isMongoDBAuth, isSupabaseAuth, isPHPAuth } from '@/config/auth';

const queryClient = new QueryClient();

import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthGuard } from '@/components/auth/AuthGuard';
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
import { HRAdmin } from '@/pages/HRAdmin';
import { Inventory } from '@/pages/Inventory';
import { ReportsPage } from '@/pages/ReportsPage';
import { Settings } from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

function App() {
  console.log('App: Component rendering');
  
  // Select the appropriate auth provider based on configuration
  let AuthProviderComponent;
  if (isPHPAuth()) {
    AuthProviderComponent = PHPAuthProvider;
  } else if (isMongoDBAuth()) {
    AuthProviderComponent = MongoAuthProvider;
  } else {
    AuthProviderComponent = AuthProvider;
  }
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="youthnet-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProviderComponent>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AuthGuard />} />
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
              <Route path="/index" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProviderComponent>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
