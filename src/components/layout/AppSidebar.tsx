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
  UserPlus,
  Calendar,
  Eye,
  TrendingUp,
  Crown,
  Shield,
  X,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
  description?: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: Home, 
    roles: ['admin', 'staff', 'trainer', 'student'],
    description: 'Control center',
    badge: 'Home'
  },
  { 
    name: 'Education', 
    href: '/education', 
    icon: GraduationCap, 
    roles: ['admin', 'staff', 'trainer'],
    description: 'Academic management',
    badge: 'Core'
  },
  { 
    name: 'Skill Development', 
    href: '/skill-development', 
    icon: Users, 
    roles: ['admin', 'staff', 'trainer', 'student'],
    description: 'Training programs',
    badge: 'Skills'
  },
  { 
    name: 'Job Centre', 
    href: '/job-centre', 
    icon: Briefcase, 
    roles: ['admin', 'staff', 'student'],
    description: 'Career opportunities',
    badge: 'Jobs'
  },
  { 
    name: 'Career Centre', 
    href: '/career-centre', 
    icon: MessageSquare, 
    roles: ['admin', 'staff', 'trainer', 'student'],
    description: 'Career guidance',
    badge: 'Guide'
  },
  { 
    name: 'Education Dept', 
    href: '/education-department', 
    icon: BookOpen, 
    roles: ['admin', 'staff'],
    description: 'Department admin',
    badge: 'Dept'
  },
  { 
    name: 'Incubation', 
    href: '/incubation', 
    icon: Lightbulb, 
    roles: ['admin', 'staff', 'trainer'],
    description: 'Startup programs',
    badge: 'Innovation'
  },
  { 
    name: 'Made in Nagaland', 
    href: '/made-in-nagaland', 
    icon: ShoppingBag, 
    roles: ['admin', 'staff'],
    description: 'Local marketplace',
    badge: 'Market'
  },
  { 
    name: 'Livelihood Incubator', 
    href: '/livelihood-incubator', 
    icon: Building2, 
    roles: ['admin', 'staff'],
    description: 'Community programs',
    badge: 'Community'
  },
  { 
    name: 'HR & Admin', 
    href: '/hr-admin', 
    icon: Users, 
    roles: ['admin', 'staff'],
    description: 'Human resources',
    badge: 'HR'
  },
  { 
    name: 'User Management', 
    href: '/user-management', 
    icon: UserCog, 
    roles: ['admin', 'staff'],
    description: 'System users',
    badge: 'Users'
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Package, 
    roles: ['admin', 'staff'],
    description: 'Asset tracking',
    badge: 'Assets'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart3, 
    roles: ['admin', 'staff'],
    description: 'Analytics hub',
    badge: 'Analytics'
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings, 
    roles: ['admin', 'staff'],
    description: 'System config',
    badge: 'Config'
  },
  { 
    name: 'Role Management', 
    href: '/admin/rbac', 
    icon: Shield, 
    roles: ['admin'],
    description: 'User roles & permissions',
    badge: 'RBAC'
  },
];

const studentManagementItems = [
  {
    name: 'New Registration',
    href: '/education',
    icon: UserPlus,
    description: 'Register new students',
    badge: 'New'
  },
  {
    name: 'View Students',
    href: '/education',
    icon: Eye,
    description: 'Manage records',
    badge: 'View'
  },
  {
    name: 'Enrollment',
    href: '/education',
    icon: Calendar,
    description: 'Course enrollment',
    badge: 'Enroll'
  },
  {
    name: 'Analytics',
    href: '/education',
    icon: TrendingUp,
    description: 'Performance data',
    badge: 'Stats'
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const allowedNavItems = navigationItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const coreModules = allowedNavItems.filter(item => 
    ['Dashboard', 'Education', 'Skill Development'].includes(item.name)
  );
  
  const serviceModules = allowedNavItems.filter(item => 
    ['Job Centre', 'Career Centre', 'Incubation', 'Made in Nagaland', 'Livelihood Incubator'].includes(item.name)
  );
  
  const adminModules = allowedNavItems.filter(item => 
    ['Education Dept', 'HR & Admin', 'User Management', 'Inventory', 'Reports', 'Settings', 'Role Management'].includes(item.name)
  );

  const isActive = (href: string) => location.pathname === href;

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const renderNavSection = (title: string, items: NavigationItem[], colorClass: string = 'text-blue-600') => {
    if (items.length === 0) return null;

    return (
      <SidebarGroup className="mb-4">
        <SidebarGroupLabel className={`text-black font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-2`}>
          {!isCollapsed && (
            <>
              <div className={`w-1.5 h-1.5 rounded-full bg-black`}></div>
              {title}
              <Badge variant="secondary" className="text-xs ml-auto bg-gray-100 text-black border-gray-300">
                {items.length}
              </Badge>
            </>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.href)}
                  className={`group transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'bg-gray-200 text-black shadow-sm border-l-2 border-black' 
                      : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <Link to={item.href} className="flex items-center gap-3 p-2.5" onClick={handleLinkClick}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive(item.href) 
                        ? 'bg-gray-300 text-black' 
                        : 'bg-gray-200 group-hover:bg-gray-300 text-black'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate text-black">{item.name}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs border-gray-700 text-black bg-gray-100">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <span className="block text-xs text-gray-700 truncate mt-0.5">
                            {item.description}
                          </span>
                        )}
                      </div>
                    )}
                    {!isCollapsed && (
                      <ChevronRight className="h-3 w-3 text-black transition-colors" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  const renderStudentManagementSection = () => {
    if (!profile?.role || !['admin', 'staff'].includes(profile.role)) {
      return null;
    }

    return (
      <SidebarGroup className="mb-4">
        <SidebarGroupLabel className="text-black font-medium text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
          {!isCollapsed && (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>  
              Student Hub
              <Badge variant="secondary" className="text-xs ml-auto bg-gray-100 text-black border-gray-300">
                {studentManagementItems.length}
              </Badge>
            </>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {studentManagementItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.href)}
                  className={`group transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'bg-gray-200 text-black shadow-sm border-l-2 border-black' 
                      : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <Link to={item.href} className="flex items-center gap-3 p-2.5" onClick={handleLinkClick}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive(item.href) 
                        ? 'bg-gray-300 text-black' 
                        : 'bg-gray-200 group-hover:bg-gray-300 text-black'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm truncate text-black">{item.name}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs border-gray-700 text-black bg-gray-100">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="block text-xs text-gray-700 truncate mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    )}
                    {!isCollapsed && (
                      <ChevronRight className="h-3 w-3 text-black transition-colors" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  };

  return (
    <Sidebar className="border-r border-blue-600/20 bg-gradient-to-b from-blue-600 to-blue-800 backdrop-blur-xl text-white" collapsible="icon">
      {/* Premium Header */}
      <SidebarHeader className="border-b border-slate-200/60 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shadow-lg">
                <img 
                  src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                  alt="YouthNet Logo" 
                  className="w-5 h-5 sm:w-6 sm:h-6 object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Crown className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
              </div>
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-base sm:text-lg font-bold text-black">YouthNet</span>
                <div className="text-xs text-gray-800 font-medium">Premium MIS</div>
              </div>
            )}
          </div>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpenMobile(false)}
              className="hover:bg-slate-100 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      {/* User Info */}
      {profile && !isCollapsed && (
        <div className="px-4 py-3 border-b border-border">
          <div className="bg-gradient-to-r from-muted to-accent/50 rounded-xl p-3 border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative overflow-hidden shadow-sm">
                <span className="text-primary-foreground text-sm font-bold relative z-10">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-black truncate">
                  {profile.full_name || 'User'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gray-200 text-black border-gray-700 text-xs capitalize">
                    <Shield className="h-2 w-2 mr-1 text-black" />
                    {profile.role}
                  </Badge>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <SidebarContent className="px-3 py-4 space-y-2 overflow-y-auto">
        {renderNavSection('Core Modules', coreModules, 'text-primary')}
        {renderStudentManagementSection()}
        {renderNavSection('Services', serviceModules, 'text-secondary')}
        {renderNavSection('Administration', adminModules, 'text-muted-foreground')}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border p-4">
        {!isCollapsed && (
          <div className="bg-gradient-to-r from-emerald-50 to-primary/5 rounded-xl p-3 text-center border">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-black font-medium">System Online</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-800">
              <span className="font-mono font-bold">v2.1.0</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
