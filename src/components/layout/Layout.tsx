
import React, { Suspense } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutProps {
  children: React.ReactNode;
}

const LoadingSkeleton = () => (
  <div className="flex-1 p-6 space-y-6">
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Sidebar Toggle */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/40 glass-effect backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <h1 className="text-xl font-bold text-gradient">YouthNet</h1>
              </div>
            </div>
            
            <TopNavbar />
          </header>

          {/* Main Content with Suspense */}
          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={<LoadingSkeleton />}>
              <div className="p-6">
                {children}
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
