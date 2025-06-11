
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Education', href: '/education', icon: GraduationCap },
  { name: 'Skill Development', href: '/skill-development', icon: Users },
  { name: 'Job Centre', href: '/job-centre', icon: Briefcase },
  { name: 'Career Centre', href: '/career-centre', icon: MessageSquare },
  { name: 'Education Dept', href: '/education-department', icon: BookOpen },
  { name: 'Incubation', href: '/incubation', icon: Lightbulb },
  { name: 'Made in Nagaland', href: '/made-in-nagaland', icon: ShoppingBag },
  { name: 'Livelihood Incubator', href: '/livelihood-incubator', icon: Building2 },
  { name: 'HR & Admin', href: '/hr', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">YN</span>
          </div>
          <span className="text-xl font-semibold text-sidebar-foreground">YouthNet</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                isActive ? "text-sidebar-accent-foreground" : "text-muted-foreground"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-sidebar-accent-foreground" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground text-center">
          YouthNet MIS v1.0
        </div>
      </div>
    </div>
  );
};
