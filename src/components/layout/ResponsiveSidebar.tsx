
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  GraduationCap, 
  Briefcase, 
  MessageSquare,
  BookOpen,
  Lightbulb,
  ShoppingBag,
  Building2,
  Settings,
  BarChart3,
  Package,
  UserCog,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home, 
    roles: ['admin', 'staff', 'trainer', 'student'],
    description: 'Overview and quick access'
  },
  { 
    name: 'Education', 
    href: '/education', 
    icon: GraduationCap, 
    roles: ['admin', 'staff', 'trainer'],
    description: 'Course and curriculum management'
  },
  { 
    name: 'Skill Development', 
    href: '/skill-development', 
    icon: Users, 
    roles: ['admin', 'staff', 'trainer', 'student'],
    description: 'Skills assessment and training'
  },
  { 
    name: 'Job Centre', 
    href: '/job-centre', 
    icon: Briefcase, 
    roles: ['admin', 'staff', 'student'],
    description: 'Job postings and applications'
  },
  { 
    name: 'Career Centre', 
    href: '/career-centre', 
    icon: MessageSquare, 
    roles: ['admin', 'staff', 'trainer', 'student'],
    description: 'Career guidance and counselling'
  },
  { 
    name: 'Education Dept', 
    href: '/education-department', 
    icon: BookOpen, 
    roles: ['admin', 'staff'],
    description: 'Department administration'
  },
  { 
    name: 'Incubation', 
    href: '/incubation', 
    icon: Lightbulb, 
    roles: ['admin', 'staff', 'trainer'],
    description: 'Startup incubation programs'
  },
  { 
    name: 'Made in Nagaland', 
    href: '/made-in-nagaland', 
    icon: ShoppingBag, 
    roles: ['admin', 'staff'],
    description: 'Local products marketplace'
  },
  { 
    name: 'Livelihood Incubator', 
    href: '/livelihood-incubator', 
    icon: Building2, 
    roles: ['admin', 'staff'],
    description: 'Community livelihood programs'
  },
  { 
    name: 'HR & Admin', 
    href: '/hr-admin', 
    icon: Users, 
    roles: ['admin', 'staff'],
    description: 'Human resources management'
  },
  { 
    name: 'User Management', 
    href: '/user-management', 
    icon: UserCog, 
    roles: ['admin', 'staff'],
    description: 'Manage system users'
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Package, 
    roles: ['admin', 'staff'],
    description: 'Asset and inventory tracking'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart3, 
    roles: ['admin', 'staff'],
    description: 'Analytics and reporting'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings, 
    roles: ['admin', 'staff'],
    description: 'System configuration'
  },
];

interface ResponsiveSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const ResponsiveSidebar = ({ isOpen, setIsOpen }: ResponsiveSidebarProps) => {
  const location = useLocation();
  const { profile } = useAuth();

  // Filter navigation items based on user role
  const allowedNavItems = navigationItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  // Group navigation items by category for better organization
  const coreModules = allowedNavItems.filter(item => 
    ['Dashboard', 'Education', 'Skill Development'].includes(item.name)
  );
  
  const serviceModules = allowedNavItems.filter(item => 
    ['Job Centre', 'Career Centre', 'Incubation', 'Made in Nagaland', 'Livelihood Incubator'].includes(item.name)
  );
  
  const adminModules = allowedNavItems.filter(item => 
    ['Education Dept', 'HR & Admin', 'User Management', 'Inventory', 'Reports', 'Settings'].includes(item.name)
  );

  const renderNavSection = (title: string, items: NavigationItem[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="px-4 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <nav className="space-y-1">
          {items.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <div
                key={item.name}
                className="slide-in-from-left"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 mx-2",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 neon-glow-blue"
                      : "text-muted-foreground hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent"
                  )}
                >
                  <item.icon className={cn(
                    "mr-3 h-5 w-5 transition-all duration-300",
                    isActive 
                      ? "text-blue-400 scale-110" 
                      : "text-muted-foreground group-hover:text-blue-400 group-hover:scale-110"
                  )} />
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{item.name}</span>
                    {item.description && (
                      <span className="block text-xs text-muted-foreground/70 truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-blue-400 animate-pulse flex-shrink-0" />
                  )}
                  <div className={cn(
                    "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                    "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
                    "group-hover:opacity-100"
                  )} />
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 glass-effect border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">YouthNet</span>
              <div className="text-xs text-muted-foreground">Futuristic MIS</div>
            </div>
          </div>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        {profile && (
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {profile.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
          {renderNavSection('Core Modules', coreModules)}
          {renderNavSection('Service Modules', serviceModules)}
          {renderNavSection('Administration', adminModules)}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-muted-foreground text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div className="text-gradient font-mono">v2.0.0</div>
          </div>
        </div>
      </div>
    </>
  );
};
