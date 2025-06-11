import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Education } from "@/pages/Education";
import NotFound from "./pages/NotFound";
import { SkillDevelopment } from "@/pages/SkillDevelopment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="dark min-h-screen w-full">
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } />
                <Route path="/education" element={
                  <Layout>
                    <Education />
                  </Layout>
                } />
                <Route path="/skill-development" element={
                  <Layout>
                    <SkillDevelopment />
                  </Layout>
                } />
                <Route path="/job-centre" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Job Centre</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/career-centre" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Career Development Centre</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/education-department" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">YouthNet Education Department</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/incubation" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Incubation Centre</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/made-in-nagaland" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Made in Nagaland Centre</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/livelihood-incubator" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Livelihood Business Incubator</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/hr" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">HR & Admin</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/inventory" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/reports" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="/settings" element={
                  <Layout>
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold mb-4">Settings</h1>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </Layout>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
