import React from 'react';
import { Building2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-sidebar-border/50">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-secondary-foreground" />
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-sidebar-foreground font-display gradient-text truncate">
              SKILL INDIA
            </h2>
            <p className="text-xs text-sidebar-muted-foreground font-medium uppercase tracking-wider">
              Digital Platform
            </p>
          </div>
        )}
      </div>
    </div>
  );
}