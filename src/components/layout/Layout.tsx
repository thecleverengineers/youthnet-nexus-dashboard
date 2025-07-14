
import React, { Suspense } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutProps {
  children: React.ReactNode;
}

const LoadingSkeleton = () => (
  <div className="flex-1 p-8 space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/3 neon-card" />
      <Skeleton className="h-6 w-1/2 neon-card" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton className="h-40 neon-card neon-glow-pink" />
      <Skeleton className="h-40 neon-card neon-glow-cyan" />
      <Skeleton className="h-40 neon-card neon-glow-purple" />
      <Skeleton className="h-40 neon-card neon-glow-green" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-80 neon-card neon-glow-pink" />
      <Skeleton className="h-80 neon-card neon-glow-cyan" />
    </div>
  </div>
);

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Neon Header */}
          <header className="h-16 flex items-center justify-between px-6 neon-card border-b border-border/30">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:neon-glow-pink transition-all duration-200 p-2 rounded-lg text-foreground hover:text-neon-pink" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple flex items-center justify-center shadow-lg neon-glow-pink">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-gradient">YouthNet</h1>
                  <span className="text-xs text-muted-foreground font-medium">AI-Powered Management System</span>
                </div>
              </div>
            </div>
            
            <TopNavbar />
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
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
