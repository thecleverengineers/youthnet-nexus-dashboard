
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
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, badge: null },
  { name: 'Education', href: '/education', icon: GraduationCap, badge: 'New' },
  { name: 'Skill Development', href: '/skill-development', icon: Users, badge: null },
  { name: 'Job Centre', href: '/job-centre', icon: Briefcase, badge: '12' },
  { name: 'Career Centre', href: '/career-centre', icon: MessageSquare, badge: null },
  { name: 'Education Dept', href: '/education-department', icon: BookOpen, badge: null },
  { name: 'Incubation', href: '/incubation', icon: Lightbulb, badge: 'AI' },
  { name: 'Made in Nagaland', href: '/made-in-nagaland', icon: ShoppingBag, badge: null },
  { name: 'Livelihood Incubator', href: '/livelihood-incubator', icon: Building2, badge: null },
  { name: 'HR & Admin', href: '/hr-admin', icon: Users, badge: null },
  { name: 'Inventory', href: '/inventory', icon: Package, badge: null },
  { name: 'Reports', href: '/reports', icon: BarChart3, badge: null },
  { name: 'Settings', href: '/settings', icon: Settings, badge: null },
];

export const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="sidebar"
      className="border-r border-border/40 glass-effect backdrop-blur-xl"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/20 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
          </div>
          {!isCollapsed && (
            <div className="space-y-1">
              <span className="text-xl font-bold text-gradient">YouthNet</span>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Futuristic MIS
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 mb-2">
            {!isCollapsed ? 'Main Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem 
                    key={item.name}
                    className="slide-in-from-left"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive}
                      className={cn(
                        "group relative rounded-xl transition-all duration-300 hover:shadow-lg",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 neon-glow-blue shadow-lg"
                          : "hover:bg-accent/50 hover:text-accent-foreground border border-transparent hover:border-accent/20"
                      )}
                    >
                      <Link to={item.href} className="flex items-center w-full">
                        <item.icon className={cn(
                          "transition-all duration-300",
                          isActive 
                            ? "text-blue-400 scale-110" 
                            : "text-muted-foreground group-hover:text-primary group-hover:scale-105"
                        )} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 ml-3">{item.name}</span>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <Badge 
                                  variant={item.badge === 'AI' ? 'default' : 'secondary'}
                                  className={cn(
                                    "text-xs px-2 py-0.5",
                                    item.badge === 'AI' && "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse",
                                    item.badge === 'New' && "bg-green-500/20 text-green-400 border-green-500/30"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {isActive && (
                                <ChevronRight className="h-4 w-4 text-blue-400" />
                              )}
                            </div>
                          </>
                        )}
                        
                        {/* Hover effect overlay */}
                        <div className={cn(
                          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                          "bg-gradient-to-r from-blue-500/5 to-purple-500/5",
                          "group-hover:opacity-100"
                        )} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/20 p-4">
        <div className="space-y-3">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-3 h-3 text-green-400" />
                <span>System Online</span>
              </div>
              <div className="text-gradient font-mono font-semibold">v2.0.0</div>
            </div>
          )}
          
          {/* Performance indicator */}
          <div className={cn(
            "rounded-lg p-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20",
            !isCollapsed ? "block" : "hidden"
          )}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-400">Performance</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono">98%</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
