
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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile-Optimized Header */}
          <header className="sticky top-0 z-40 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <SidebarTrigger className="hover:bg-slate-100 hover:text-slate-700 transition-all duration-200 rounded-lg p-2 min-h-[44px] min-w-[44px] touch-manipulation">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </SidebarTrigger>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden shadow-sm">
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
            
            {/* Mobile Status & TopNavbar Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="hidden xs:inline">Online</span>
              </div>
            </div>
          </header>

          <TopNavbar />
          
          {/* Mobile-Optimized Main Content */}
          <main className="flex-1 overflow-y-auto overscroll-behavior-contain">
            <div className="min-h-full p-3 sm:p-4 lg:p-6 pb-safe">
              <div className="max-w-full mx-auto w-full space-y-4 sm:space-y-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
