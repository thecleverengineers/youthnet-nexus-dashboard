
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile-Optimized Header */}
          <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border bg-background/95 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-lg p-2 min-h-[44px] min-w-[44px] touch-manipulation">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm ring-2 ring-primary/20">
                  <img 
                    src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                    alt="YouthNet Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display">
                  YouthNet Nexus
                </span>
              </div>
            </div>
            
            {/* Mobile Status Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline font-medium">System Online</span>
              </div>
            </div>
          </header>

          <TopNavbar />
          
          {/* Mobile-Optimized Main Content */}
          <main className="flex-1 overflow-y-auto overscroll-behavior-contain">
            <div className="min-h-full p-4 lg:p-6 pb-safe-area-inset-bottom">
              <div className="max-w-full mx-auto w-full space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
