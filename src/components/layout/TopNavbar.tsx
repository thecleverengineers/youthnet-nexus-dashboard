
import React from 'react';
import { Bell, Search, User, Zap, Activity, Sun, Moon, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/ui/theme-provider';

export const TopNavbar = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
          <Input
            placeholder="Search across all modules..."
            className="pl-10 bg-slate-50/80 border-slate-200/60 focus:bg-white focus:border-blue-300 transition-all duration-300 rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* System Status */}
      <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-emerald-50 border border-emerald-200/60 shadow-sm">
        <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
        <span className="text-xs text-emerald-700 font-medium">ONLINE</span>
      </div>

      {/* Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 transition-colors">
            <Sun className="h-5 w-5 text-slate-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl">
          <DropdownMenuLabel className="text-slate-700">Theme</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-200/60" />
          <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-slate-50 text-slate-700">
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-slate-50 text-slate-700">
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-slate-50 text-slate-700">
            <Settings2 className="mr-2 h-4 w-4" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white shadow-md">
              3
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl">
          <DropdownMenuLabel className="text-slate-700 font-semibold">Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-200/60" />
          <DropdownMenuItem className="flex flex-col items-start py-4 hover:bg-slate-50 rounded-lg mx-2 my-1">
            <div className="font-medium text-slate-800">New placement record</div>
            <div className="text-sm text-slate-600">5 candidates placed this week</div>
            <div className="text-xs text-blue-600 mt-1">2 hours ago</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start py-4 hover:bg-slate-50 rounded-lg mx-2 my-1">
            <div className="font-medium text-slate-800">Training batch completed</div>
            <div className="text-sm text-slate-600">Digital Marketing batch graduation</div>
            <div className="text-xs text-blue-600 mt-1">4 hours ago</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start py-4 hover:bg-slate-50 rounded-lg mx-2 my-1">
            <div className="font-medium text-slate-800">Monthly report due</div>
            <div className="text-sm text-slate-600">Submit department reports by Friday</div>
            <div className="text-xs text-blue-600 mt-1">1 day ago</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 px-3 hover:bg-slate-100 rounded-xl transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-sm font-semibold text-slate-800">Admin User</span>
              <span className="text-xs text-blue-600 font-medium">System Admin</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl">
          <DropdownMenuLabel className="text-slate-700 font-semibold">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-200/60" />
          <DropdownMenuItem className="hover:bg-slate-50 rounded-lg mx-2 my-1 text-slate-700">
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-slate-50 rounded-lg mx-2 my-1 text-slate-700">
            Preferences
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-200/60" />
          <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg mx-2 my-1">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
