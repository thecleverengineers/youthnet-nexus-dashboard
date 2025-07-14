
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleBasedRoute } from '@/components/auth/RoleBasedRoute';
import { Skeleton } from "@/components/ui/skeleton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load components for better performance
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Index = lazy(() => import('@/pages/Index'));
const Education = lazy(() => import('@/pages/Education').then(module => ({ default: module.Education })));
const SkillDevelopment = lazy(() => import('@/pages/SkillDevelopment').then(module => ({ default: module.SkillDevelopment })));
const JobCentre = lazy(() => import('@/pages/JobCentre').then(module => ({ default: module.JobCentre })));
const CareerCentre = lazy(() => import('@/pages/CareerCentre').then(module => ({ default: module.CareerCentre })));
const EducationDepartment = lazy(() => import('@/pages/EducationDepartment').then(module => ({ default: module.EducationDepartment })));
const Incubation = lazy(() => import('@/pages/Incubation').then(module => ({ default: module.Incubation })));
const MadeInNagaland = lazy(() => import('@/pages/MadeInNagaland').then(module => ({ default: module.MadeInNagaland })));
const LivelihoodIncubator = lazy(() => import('@/pages/LivelihoodIncubator').then(module => ({ default: module.LivelihoodIncubator })));
const HRAdmin = lazy(() => import('@/pages/HRAdmin').then(module => ({ default: module.HRAdmin })));
const Inventory = lazy(() => import('@/pages/Inventory').then(module => ({ default: module.Inventory })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then(module => ({ default: module.ReportsPage })));
const Settings = lazy(() => import('@/pages/Settings').then(module => ({ default: module.Settings })));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/3 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
    <div className="space-y-4">
      <Skeleton className="h-64 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="youthnet-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RoleBasedRoute />} />
              <Route path="/education" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <Education />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/education-department" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <EducationDepartment />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/skill-development" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <SkillDevelopment />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/job-centre" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <JobCentre />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/career-centre" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <CareerCentre />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/incubation" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <Incubation />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/made-in-nagaland" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <MadeInNagaland />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/livelihood-incubator" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <LivelihoodIncubator />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/hr-admin" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <HRAdmin />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <Inventory />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <ReportsPage />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<PageLoadingSkeleton />}>
                      <Settings />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/index" element={
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Index />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
