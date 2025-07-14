
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
      className="border-r border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-xl"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-slate-200/40 p-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
                alt="YouthNet Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-sm"></div>
          </div>
          {!isCollapsed && (
            <div className="space-y-1">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">YouthNet</span>
              <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Brain className="w-3 h-3" />
                AI-Powered MIS
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        {navigationGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.title} className="mb-6">
            <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">
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
                            ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 border border-blue-200/50 shadow-sm"
                            : "hover:bg-slate-100/70 hover:text-slate-900 border border-transparent hover:border-slate-200/50"
                        )}
                        tooltip={isCollapsed ? item.name : undefined}
                      >
                        <Link to={item.href} className="flex items-center w-full p-3">
                          <item.icon className={cn(
                            "transition-all duration-300 shrink-0",
                            isActive 
                              ? "text-blue-600 scale-110" 
                              : "text-slate-500 group-hover:text-slate-700 group-hover:scale-105"
                          )} 
                          size={20}
                          />
                          
                          {!isCollapsed && (
                            <>
                              <div className="flex-1 ml-3">
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5 group-hover:text-slate-600">
                                  {item.description}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {item.badge && (
                                  <Badge 
                                    variant={item.badge === 'AI' ? 'default' : 'secondary'}
                                    className={cn(
                                      "text-xs px-2 py-0.5 font-medium",
                                      item.badge === 'AI' && "bg-gradient-to-r from-purple-600 to-blue-600 text-white animate-pulse shadow-md",
                                      item.badge === 'New' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                                      item.badge !== 'AI' && item.badge !== 'New' && "bg-slate-100 text-slate-700"
                                    )}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                                {isActive && (
                                  <ChevronRight className="h-4 w-4 text-blue-500" />
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

      <SidebarFooter className="border-t border-slate-200/40 p-4">
        <div className="space-y-4">
          {!isCollapsed && (
            <div className="text-xs text-slate-500 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50">
                <Activity className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-emerald-700">System Status</div>
                  <div className="text-emerald-600">All services online</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Version</span>
                <span className="font-mono font-semibold text-slate-600">v2.1.0</span>
              </div>
            </div>
          )}
          
          {/* Performance indicator for collapsed state */}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200/50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
