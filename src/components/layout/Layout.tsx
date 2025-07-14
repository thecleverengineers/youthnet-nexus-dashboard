
import React, { Suspense } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutProps {
  children: React.ReactNode;
}

const LoadingSkeleton = () => (
  <div className="flex-1 p-8 space-y-8 bg-gray-50/50">
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/3 bg-white/80" />
      <Skeleton className="h-6 w-1/2 bg-white/60" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton className="h-40 bg-white shadow-sm rounded-xl" />
      <Skeleton className="h-40 bg-white shadow-sm rounded-xl" />
      <Skeleton className="h-40 bg-white shadow-sm rounded-xl" />
      <Skeleton className="h-40 bg-white shadow-sm rounded-xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-80 bg-white shadow-sm rounded-xl" />
      <Skeleton className="h-80 bg-white shadow-sm rounded-xl" />
    </div>
  </div>
);

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Professional Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 p-2 rounded-lg" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">YouthNet</h1>
                  <span className="text-xs text-slate-500 font-medium">Management Information System</span>
                </div>
              </div>
            </div>
            
            <TopNavbar />
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 via-white/30 to-blue-50/20">
            <Suspense fallback={<LoadingSkeleton />}>
              <div className="p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
