import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import { Index } from '@/pages/Index';
import { Education } from '@/pages/Education';
import { SkillDevelopment } from '@/pages/SkillDevelopment';
import { JobCentre } from '@/pages/JobCentre';
import { CareerCentre } from '@/pages/CareerCentre';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="youthnet-theme">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/education" element={
              <ProtectedRoute>
                <Layout>
                  <Education />
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
            <Route path="/index" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
