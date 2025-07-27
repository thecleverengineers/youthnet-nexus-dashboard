import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Search, Star, Clock, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { NavigationSection } from './sidebar/NavigationSection';
import { UserProfile } from './sidebar/UserProfile';
import { SearchBar } from './sidebar/SearchBar';
import { navigationConfig } from './sidebar/navigationConfig';
import { cn } from '@/lib/utils';

export function ModernSidebar() {
  const location = useLocation();
  const { profile, user, signOut, loading } = useAuth();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['core']);
  
  const isCollapsed = !isMobile && state === 'collapsed';
  const currentPath = location.pathname;

  // Filter navigation based on user role
  const getFilteredNavigation = () => {
    if (!profile?.role) return navigationConfig.filter(section => section.id === 'core');
    
    return navigationConfig.filter(section => {
      if (section.roles.includes('all')) return true;
      return section.roles.includes(profile.role);
    });
  };

  const filteredNavigation = getFilteredNavigation();

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (loading) {
    return (
      <div className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-br from-sidebar-background/95 to-sidebar-background/90",
        "backdrop-blur-xl border-r border-sidebar-border shadow-2xl z-50",
        "glass-effect transition-all duration-300",
        isCollapsed ? "w-16" : "w-80"
      )}>
        <div className="p-6 space-y-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-accent rounded-xl"></div>
            {!isCollapsed && <div className="h-6 bg-sidebar-accent rounded w-32"></div>}
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sidebar-accent rounded-lg"></div>
              {!isCollapsed && <div className="h-4 bg-sidebar-accent rounded w-24"></div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-gradient-to-br from-sidebar-background/95 to-sidebar-background/90",
      "backdrop-blur-xl border-r border-sidebar-border shadow-2xl z-50",
      "glass-effect transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <SidebarHeader isCollapsed={isCollapsed} />

        {/* Search */}
        {!isCollapsed && (
          <div className="px-4 pb-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search navigation..."
            />
          </div>
        )}

        {/* User Profile */}
        <div className="px-4 pb-4">
          <UserProfile 
            user={user}
            profile={profile}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent">
          <div className="px-3 pb-4 space-y-2">
            {filteredNavigation.map((section) => (
              <NavigationSection
                key={section.id}
                section={section}
                isCollapsed={isCollapsed}
                isExpanded={expandedSections.includes(section.id)}
                onToggle={() => toggleSection(section.id)}
                currentPath={currentPath}
                onItemClick={handleItemClick}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border/50 p-4">
          <div className="flex items-center space-x-3">
            {!isCollapsed ? (
              <>
                <button className="flex-1 flex items-center space-x-2 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={signOut}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 w-full">
                <button className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors">
                  <Settings className="w-4 h-4 text-sidebar-foreground" />
                </button>
                <button 
                  onClick={signOut}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-destructive" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}