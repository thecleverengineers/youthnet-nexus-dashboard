
import React from 'react';
import { Bell, Search, User, Menu, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const TopNavbar = () => {
  return (
    <div className="flex items-center justify-between h-full w-full">
      {/* Search - Hidden on mobile, responsive on tablet/desktop */}
      <div className="hidden sm:flex relative flex-1 max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 bg-white/5 border-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 rounded-lg text-sm"
        />
      </div>

      {/* Right side - responsive spacing */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* System Status - Hidden on mobile */}
        <div className="hidden sm:flex items-center space-x-2 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30">
          <Activity className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-400">ONLINE</span>
        </div>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu - responsive sizing */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-lg p-2 hover:bg-white/5">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-white">Admin User</div>
                  <div className="text-xs text-muted-foreground">Super Admin</div>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-effect border-white/20 z-50">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
