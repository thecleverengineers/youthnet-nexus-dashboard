import React from 'react';
import { User, Crown, Shield, GraduationCap, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  user: any;
  profile: any;
  isCollapsed: boolean;
}

const roleIcons = {
  admin: Crown,
  staff: Shield,
  trainer: GraduationCap,
  student: Users,
};

const roleColors = {
  admin: 'from-red-500 to-red-600',
  staff: 'from-blue-500 to-blue-600',
  trainer: 'from-green-500 to-green-600',
  student: 'from-purple-500 to-purple-600',
};

export function UserProfile({ user, profile, isCollapsed }: UserProfileProps) {
  if (!user || !profile) {
    return (
      <div className="px-3 py-2 bg-sidebar-accent/30 rounded-xl border border-sidebar-border/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sidebar-accent rounded-full animate-pulse" />
          {!isCollapsed && (
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-sidebar-accent rounded w-20 animate-pulse" />
              <div className="h-2 bg-sidebar-accent rounded w-16 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const RoleIcon = roleIcons[profile.role as keyof typeof roleIcons] || User;
  const roleColor = roleColors[profile.role as keyof typeof roleColors] || 'from-gray-500 to-gray-600';

  return (
    <div className="px-3 py-2 bg-gradient-to-r from-sidebar-accent/20 to-sidebar-accent/10 rounded-xl border border-sidebar-border/50 hover:bg-sidebar-accent/30 transition-all duration-200">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="w-10 h-10 ring-2 ring-sidebar-border/50">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-sidebar-foreground font-semibold">
              {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
            "bg-gradient-to-br shadow-lg ring-2 ring-sidebar-background",
            roleColor
          )}>
            <RoleIcon className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              {profile.full_name || 'User'}
            </p>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs px-2 py-0.5 bg-gradient-to-r text-white border-0",
                  roleColor
                )}
              >
                {profile.role?.charAt(0).toUpperCase() + profile.role?.slice(1)}
              </Badge>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}