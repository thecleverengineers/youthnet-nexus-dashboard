
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  onClick: () => void;
  className?: string;
}

export const SidebarToggle = ({ onClick, className }: SidebarToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "lg:hidden p-2 hover:bg-white/5 transition-colors",
        className
      )}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
};
