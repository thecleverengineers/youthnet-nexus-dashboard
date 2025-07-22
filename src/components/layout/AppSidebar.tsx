
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
  FileText
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

// Student Management specific items for admin and staff
const studentManagementItems = [
  {
    name: 'New Registration',
    href: '/education',
    icon: UserPlus,
    description: 'Register new students'
  },
  {
    name: 'View Students',
    href: '/education',
    icon: Users,
    description: 'Manage student records'
  },
  {
    name: 'Enrollment',
    href: '/education',
    icon: Calendar,
    description: 'Manage enrollments'
  },
  {
    name: 'Analytics',
    href: '/education',
    icon: BarChart3,
    description: 'Student performance reports'
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Filter navigation items based on user role
  const allowedNavItems = navigationItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  // Group navigation items by category
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

  const renderNavSection = (title: string, items: NavigationItem[]) => {
    if (items.length === 0) return null;

    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.href)}
                  className="w-full justify-start"
                >
                  <Link to={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{item.name}</span>
                        {item.description && (
                          <span className="block text-xs text-muted-foreground/70 truncate">
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
    // Only show for admin and staff
    if (!profile?.role || !['admin', 'staff'].includes(profile.role)) {
      return null;
    }

    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Student Management
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {studentManagementItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive(item.href)}
                  className="w-full justify-start"
                >
                  <Link to={item.href} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <span className="block truncate">{item.name}</span>
                        <span className="block text-xs text-muted-foreground/70 truncate">
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
    <Sidebar className="border-r border-white/10" collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
              alt="YouthNet Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-bold text-gradient">YouthNet</span>
              <div className="text-xs text-muted-foreground">Futuristic MIS</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* User info */}
      {profile && !isCollapsed && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {profile.full_name || 'User'}
              </p>
              <Badge variant="secondary" className="text-xs capitalize">
                {profile.role}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <SidebarContent className="px-2 py-4 space-y-2">
        {renderNavSection('Core Modules', coreModules)}
        {renderStudentManagementSection()}
        {renderNavSection('Service Modules', serviceModules)}
        {renderNavSection('Administration', adminModules)}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 p-4">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div className="text-gradient font-mono">v2.0.0</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
