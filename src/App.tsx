
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import { Education } from "./pages/Education";
import { SkillDevelopment } from "./pages/SkillDevelopment";
import { CareerCentre } from "./pages/CareerCentre";
import { JobCentre } from "./pages/JobCentre";
import { Incubation } from "./pages/Incubation";
import { LivelihoodIncubator } from "./pages/LivelihoodIncubator";
import { MadeInNagaland } from "./pages/MadeInNagaland";
import { Inventory } from "./pages/Inventory";
import { HRAdmin } from "./pages/HRAdmin";
import { ReportsPage } from "./pages/ReportsPage";
import { Settings } from "./pages/Settings";
import { EducationDepartment } from "./pages/EducationDepartment";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MongoAuthProvider } from "@/hooks/useMongoAuth";
import { ConnectionStatus } from "@/components/common/ConnectionStatus";
import { NotificationCenter } from "@/components/common/NotificationCenter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <MongoAuthProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  {/* Global connection status */}
                  <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
                    <NotificationCenter />
                    <ConnectionStatus />
                  </div>
                  
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/education" element={<Education />} />
                    <Route path="/education-department" element={<EducationDepartment />} />
                    <Route path="/skill-development" element={<SkillDevelopment />} />
                    <Route path="/career-centre" element={<CareerCentre />} />
                    <Route path="/job-centre" element={<JobCentre />} />
                    <Route path="/incubation" element={<Incubation />} />
                    <Route path="/livelihood" element={<LivelihoodIncubator />} />
                    <Route path="/made-in-nagaland" element={<MadeInNagaland />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/hr-admin" element={<HRAdmin />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
              <Toaster richColors closeButton position="top-right" />
            </MongoAuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
