import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';

interface MobileNavigationSheetProps {
  children?: React.ReactNode;
}

export const MobileNavigationSheet = ({ children }: MobileNavigationSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="md:hidden p-2 h-10 w-10 hover:bg-slate-100 rounded-lg touch-manipulation"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-80 border-r border-blue-600/20">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Access all application features</SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-hidden">
          {children || <AppSidebar />}
        </div>
      </SheetContent>
    </Sheet>
  );
};