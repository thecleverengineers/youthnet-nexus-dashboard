
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
  Shield,
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
  { name: 'HR & Admin', href: '/hr-admin', icon: Users },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Authentication', href: '/authentication', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex h-full w-full flex-col glass-effect border-r border-white/10">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-white/10">
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
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <div
              key={item.name}
              className="slide-in-from-left"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link
                to={item.href}
                className={cn(
                  "relative group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent hover:shadow-md"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-4 w-4 flex-shrink-0 transition-all duration-200",
                  isActive 
                    ? "text-blue-400" 
                    : "text-muted-foreground group-hover:text-blue-400"
                )} />
                <span className="flex-1 truncate">{item.name}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

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
  );
};
