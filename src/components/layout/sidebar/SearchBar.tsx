import React from 'react';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sidebar-muted-foreground">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-10 py-2.5 bg-sidebar-accent/30 border border-sidebar-border/50",
          "rounded-lg text-sm text-sidebar-foreground placeholder-sidebar-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
          "transition-all duration-200 hover:bg-sidebar-accent/40"
        )}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div className="flex items-center space-x-1 text-xs text-sidebar-muted-foreground">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>
    </div>
  );
}