
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
  Activity,
  Sparkles,
  Target,
  TrendingUp,
  Shield,
  Brain,
  Zap
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

const navigationGroups = [
  {
    title: "Dashboard",
    items: [
      { name: 'Overview', href: '/', icon: Home, description: 'Main dashboard overview' }
    ]
  },
  {
    title: "Education & Training",
    items: [
      { name: 'Education', href: '/education', icon: GraduationCap, badge: 'New', description: 'Educational programs management' },
      { name: 'Education Dept', href: '/education-department', icon: BookOpen, description: 'Department administration' },
      { name: 'Skill Development', href: '/skill-development', icon: Users, description: 'Skills training programs' }
    ]
  },
  {
    title: "Career & Employment",
    items: [
      { name: 'Job Centre', href: '/job-centre', icon: Briefcase, badge: '12', description: 'Job postings and applications' },
      { name: 'Career Centre', href: '/career-centre', icon: MessageSquare, description: 'Career counseling services' }
    ]
  },
  {
    title: "Innovation & Enterprise",
    items: [
      { name: 'Incubation', href: '/incubation', icon: Lightbulb, badge: 'AI', description: 'Startup incubation programs' },
      { name: 'Made in Nagaland', href: '/made-in-nagaland', icon: ShoppingBag, description: 'Local product marketplace' },
      { name: 'Livelihood Hub', href: '/livelihood-incubator', icon: Building2, description: 'Livelihood programs' }
    ]
  },
  {
    title: "Administration",
    items: [
      { name: 'HR & Admin', href: '/hr-admin', icon: Users, description: 'Human resources management' },
      { name: 'Inventory', href: '/inventory', icon: Package, description: 'Asset and inventory tracking' },
      { name: 'Reports', href: '/reports', icon: BarChart3, description: 'Analytics and reporting' },
      { name: 'Settings', href: '/settings', icon: Settings, description: 'System configuration' }
    ]
  }
];

export const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className="border-r border-sidebar-border neon-card shadow-2xl"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border/40 p-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple flex items-center justify-center shadow-lg neon-glow-pink">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full neon-pulse shadow-sm"></div>
          </div>
          {!isCollapsed && (
            <div className="space-y-1">
              <span className="text-xl font-bold text-gradient">YouthNet</span>
              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Brain className="w-3 h-3 text-neon-cyan" />
                <span className="text-neon-cyan">AI-Powered MIS</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {!isCollapsed ? group.title : ''}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {group.items.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <SidebarMenuItem 
                      key={item.name}
                      className="animate-in slide-in-from-left duration-300"
                      style={{ animationDelay: `${(groupIndex * 100) + (index * 50)}ms` }}
                    >
                      <SidebarMenuButton 
                        asChild
                        isActive={isActive}
                        className={cn(
                          "group relative rounded-xl transition-all duration-300 hover:shadow-md mb-1",
                          isActive
                            ? "neon-card neon-glow-pink text-neon-pink border border-neon-pink/30"
                            : "hover:neon-card hover:text-foreground border border-transparent hover:border-border/30"
                        )}
                        tooltip={isCollapsed ? item.name : undefined}
                      >
                        <Link to={item.href} className="flex items-center w-full p-3">
                          <item.icon className={cn(
                            "transition-all duration-300 shrink-0",
                            isActive 
                              ? "text-neon-pink scale-110 drop-shadow-[0_0_8px_hsl(322_100%_65%/0.6)]" 
                              : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                          )} 
                          size={20}
                          />
                          
                          {!isCollapsed && (
                            <>
                              <div className="flex-1 ml-3">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-muted-foreground">
                                  {item.description}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {item.badge && (
                                  <Badge 
                                    variant={item.badge === 'AI' ? 'default' : 'secondary'}
                                    className={cn(
                                      "text-xs px-2 py-0.5 font-medium",
                                      item.badge === 'AI' && "bg-gradient-to-r from-neon-purple to-neon-cyan text-white neon-pulse shadow-md border-0",
                                      item.badge === 'New' && "bg-neon-green/20 text-neon-green border-neon-green/30",
                                      item.badge !== 'AI' && item.badge !== 'New' && "bg-muted/20 text-muted-foreground border-border/30"
                                    )}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                                {isActive && (
                                  <ChevronRight className="h-4 w-4 text-neon-pink drop-shadow-[0_0_8px_hsl(322_100%_65%/0.6)]" />
                                )}
                              </div>
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/40 p-4">
        <div className="space-y-4">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground text-center space-y-3">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg neon-card border border-neon-green/30">
                <Activity className="w-4 h-4 text-neon-green neon-pulse" />
                <div className="text-left">
                  <div className="font-medium text-neon-green">System Status</div>
                  <div className="text-neon-green/80">All services online</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs p-2 rounded border border-border/20">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono font-semibold text-neon-cyan">v2.1.0</span>
              </div>
            </div>
          )}
          
          {/* Performance indicator for collapsed state */}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg neon-card border border-neon-green/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-neon-green neon-pulse" />
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
