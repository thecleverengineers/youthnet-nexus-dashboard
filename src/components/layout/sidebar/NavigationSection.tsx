import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { NavigationSection as NavigationSectionType } from './navigationConfig';

interface NavigationSectionProps {
  section: NavigationSectionType;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
  onItemClick: () => void;
  searchQuery: string;
}

export function NavigationSection({
  section,
  isCollapsed,
  isExpanded,
  onToggle,
  currentPath,
  onItemClick,
  searchQuery
}: NavigationSectionProps) {
  // Filter items based on search query
  const filteredItems = section.items.filter(item =>
    searchQuery === '' || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="space-y-1">
      {/* Section Header */}
      {!isCollapsed && (
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold",
            "text-sidebar-muted-foreground hover:text-sidebar-foreground",
            "rounded-lg hover:bg-sidebar-accent/50 transition-all duration-200",
            "group uppercase tracking-wider"
          )}
        >
          <span className={`text-gradient-${section.color}`}>{section.title}</span>
          <ChevronDown className={cn(
            "w-3 h-3 transition-transform duration-200",
            isExpanded ? "rotate-180" : "rotate-0"
          )} />
        </button>
      )}

      {/* Navigation Items */}
      <div className={cn(
        "space-y-1 transition-all duration-300",
        !isCollapsed && !isExpanded ? "hidden" : "block"
      )}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onItemClick}
              className={({ isActive: navIsActive }) => cn(
                "group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent/50 hover:translate-x-1",
                (isActive || navIsActive) 
                  ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-l-2 border-primary shadow-lg" 
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                (isActive) 
                  ? "bg-primary/20 text-primary shadow-md" 
                  : "group-hover:bg-sidebar-accent text-sidebar-muted-foreground group-hover:text-sidebar-foreground"
              )}>
                <Icon className="w-4 h-4" />
                {item.badge && !isCollapsed && (
                  <div className="absolute -top-1 -right-1">
                    <Badge 
                      variant="destructive" 
                      className="w-4 h-4 text-xs p-0 flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  </div>
                )}
              </div>
              
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-1.5 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.isFavorite && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-xs text-sidebar-muted-foreground truncate">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}