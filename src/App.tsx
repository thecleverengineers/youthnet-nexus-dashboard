
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleBasedRoute } from "@/components/auth/RoleBasedRoute";
import { AdminInitializer } from "@/components/auth/AdminInitializer";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { StudentDashboard } from "./pages/dashboard/StudentDashboard";
import { TrainerDashboard } from "./pages/dashboard/TrainerDashboard";
import { StaffDashboard } from "./pages/dashboard/StaffDashboard";
import { Education } from "./pages/Education";
import { SkillDevelopment } from "./pages/SkillDevelopment";
import { JobCentre } from "./pages/JobCentre";
import { CareerCentre } from "./pages/CareerCentre";
import { EducationDepartment } from "./pages/EducationDepartment";
import { Incubation } from "./pages/Incubation";
import { MadeInNagaland } from "./pages/MadeInNagaland";
import { LivelihoodIncubator } from "./pages/LivelihoodIncubator";
import { HRAdmin } from "./pages/HRAdmin";
import { UserManagementPage } from "./pages/UserManagement";
import { AdminRBAC } from "./pages/AdminRBAC";
import { Profile } from "./pages/Profile";
import { Inventory } from "./pages/Inventory";
import { ReportsPage } from "./pages/ReportsPage";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <ErrorBoundary>
              <Toaster />
              <AdminInitializer />
              <BrowserRouter>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route 
                  path="/dashboard/admin" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminDashboard />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/staff" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['staff']}>
                        <Layout>
                          <StaffDashboard />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/trainer" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['trainer']}>
                        <Layout>
                          <TrainerDashboard />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/student" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['student']}>
                        <Layout>
                          <StudentDashboard />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/education" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Education />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/skill-development" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SkillDevelopment />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/job-centre" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <JobCentre />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/career-centre" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <CareerCentre />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/education-department" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <EducationDepartment />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/incubation" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Incubation />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/made-in-nagaland" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <MadeInNagaland />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/livelihood-incubator" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <LivelihoodIncubator />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/hr-admin" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                        <Layout>
                          <HRAdmin />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/user-management" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['admin', 'staff']}>
                        <Layout>
                          <UserManagementPage />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/inventory" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Inventory />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ReportsPage />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/rbac" 
                  element={
                    <ProtectedRoute>
                      <RoleBasedRoute allowedRoles={['admin']}>
                        <Layout>
                          <AdminRBAC />
                        </Layout>
                      </RoleBasedRoute>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
