
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Premium Header with mobile-friendly toggle */}
          <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
              
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img 
                    src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                    alt="YouthNet Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-lg font-bold text-gradient-primary">YouthNet</span>
              </div>
            </div>
            
            {/* Mobile logo */}
            <div className="sm:hidden flex items-center space-x-2">
              <div className="w-6 h-6 rounded overflow-hidden">
                <img 
                  src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                  alt="YouthNet Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base font-bold text-gradient-primary">YouthNet</span>
            </div>
          </header>

          <TopNavbar />
          
          {/* Main content with smooth transitions */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
