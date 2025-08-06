
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
    <header className="h-16 border-b border-white/10 glass-effect">
      <div className="flex h-16 items-center px-6 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-blue-400" />
            <Input
              placeholder="Search across all modules..."
              className="pl-10 glass-effect border-white/10 bg-white/5 focus:bg-white/10 focus:border-blue-500/50 transition-all duration-300 rounded-xl"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10" />
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full glass-effect border border-green-500/30">
          <Activity className="h-3 w-3 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationCenter />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 px-3 hover-glow rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center neon-glow-blue">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">Admin User</span>
                  <span className="text-xs text-blue-400">System Admin</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect border-white/10">
              <DropdownMenuLabel className="text-gradient">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/5 rounded-lg">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/5 rounded-lg">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 rounded-lg">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
