
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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile-first Header */}
          <header className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <SidebarTrigger className="hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 rounded-lg p-1.5 sm:p-2 -ml-1">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                    alt="YouthNet Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  YouthNet
                </span>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </header>

          <TopNavbar />
          
          {/* Main content with enhanced mobile experience */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
