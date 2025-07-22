
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
  FileText,
  Eye,
  TrendingUp,
  Crown,
  Zap,
  Shield
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
  const { state } = useSidebar();
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
    ['Education Dept', 'HR & Admin', 'User Management', 'Inventory', 'Reports', 'Settings'].includes(item.name)
  );

  const isActive = (href: string) => location.pathname === href;

  const renderNavSection = (title: string, items: NavigationItem[], gradient: string = 'primary') => {
    if (items.length === 0) return null;

    return (
      <SidebarGroup className="premium-card mb-6">
        <SidebarGroupLabel className={`text-gradient-${gradient} font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2`}>
          {!isCollapsed && (
            <>
              <div className={`w-2 h-2 rounded-full gradient-bg-${gradient}`}></div>
              {title}
              <Badge className={`gradient-bg-${gradient} text-white border-0 text-xs ml-auto`}>
                {items.length}
              </Badge>
            </>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.href)}
                  className={`premium-card hover-glow-blue group transition-all duration-300 ${
                    isActive(item.href) 
                      ? 'gradient-bg-primary text-white shadow-lg' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Link to={item.href} className="flex items-center gap-4 p-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive(item.href) 
                        ? 'bg-white/20' 
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{item.name}</span>
                          {item.badge && (
                            <Badge className="bg-white/10 text-white border-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <span className="block text-xs text-white/70 truncate mt-1">
                            {item.description}
                          </span>
                        )}
                      </div>
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
      <SidebarGroup className="premium-card mb-6">
        <SidebarGroupLabel className="text-gradient-secondary font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
          {!isCollapsed && (
            <>
              <div className="w-2 h-2 rounded-full gradient-bg-secondary"></div>  
              Student Hub
              <Badge className="gradient-bg-secondary text-white border-0 text-xs ml-auto">
                {studentManagementItems.length}
              </Badge>
            </>
          )}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="space-y-2">
            {studentManagementItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.href)}
                  className={`premium-card hover-glow-cyan group transition-all duration-300 ${
                    isActive(item.href) 
                      ? 'gradient-bg-secondary text-white shadow-lg' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Link to={item.href} className="flex items-center gap-4 p-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive(item.href) 
                        ? 'bg-white/20' 
                        : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{item.name}</span>
                          {item.badge && (
                            <Badge className="bg-white/10 text-white border-0 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <span className="block text-xs text-white/70 truncate mt-1">
                          {item.description}
                        </span>
                      </div>
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
    <Sidebar className="border-r border-white/10 glass-effect" collapsible="icon">
      {/* Premium Header */}
      <SidebarHeader className="border-b border-white/10 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl gradient-bg-primary flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="w-8 h-8 object-cover"
              />
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-bg-accent flex items-center justify-center">
              <Crown className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-xl font-bold text-gradient-primary">YouthNet</span>
              <div className="text-xs text-gradient-secondary font-medium">Premium MIS</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Premium User Info */}
      {profile && !isCollapsed && (
        <div className="px-6 py-4 border-b border-white/10">
          <div className="premium-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl gradient-bg-accent flex items-center justify-center relative overflow-hidden">
                <span className="text-white text-lg font-bold relative z-10">
                  {profile.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {profile.full_name || 'User'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="gradient-bg-primary text-white border-0 text-xs capitalize">
                    <Shield className="h-2.5 w-2.5 mr-1" />
                    {profile.role}
                  </Badge>
                  <div className="status-indicator status-online"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Navigation */}
      <SidebarContent className="px-4 py-6 space-y-4 overflow-y-auto">
        {renderNavSection('Core Modules', coreModules, 'primary')}
        {renderStudentManagementSection()}
        {renderNavSection('Services', serviceModules, 'secondary')}
        {renderNavSection('Administration', adminModules, 'accent')}
      </SidebarContent>

      {/* Premium Footer */}
      <SidebarFooter className="border-t border-white/10 p-6">
        {!isCollapsed && (
          <div className="premium-card p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="status-indicator status-online"></div>
              <span className="text-xs text-gradient-primary font-medium">System Online</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-blue-400" />
              <span className="text-gradient-accent font-mono font-bold">v2.0.0</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
