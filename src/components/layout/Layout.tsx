
import React, { useState } from 'react';
import { ResponsiveSidebar } from './ResponsiveSidebar';
import { SidebarToggle } from './SidebarToggle';
import { TopNavbar } from './TopNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <ResponsiveSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile header with sidebar toggle */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-white/10 glass-effect">
          <SidebarToggle onClick={() => setSidebarOpen(true)} />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold text-gradient">YouthNet</span>
          </div>
        </div>

        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
