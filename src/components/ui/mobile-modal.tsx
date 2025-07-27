import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MobileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export const MobileModal = ({
  open,
  onOpenChange,
  title,
  children,
  actions,
  size = 'md',
  className
}: MobileModalProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-2xl';
      case 'lg': return 'max-w-4xl';
      case 'full': return 'max-w-[95vw] h-[90vh]';
      default: return 'max-w-2xl';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "w-full max-h-[90vh] overflow-y-auto mx-4",
          getSizeClasses(),
          size === 'full' && "overflow-hidden flex flex-col",
          className
        )}
      >
        <DialogHeader className="pb-4 border-b border-slate-200">
          <DialogTitle className="text-lg font-semibold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className={cn(
          "flex-1 p-1",
          size === 'full' && "overflow-y-auto"
        )}>
          {children}
        </div>

        {actions && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            {actions}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface MobileBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  height?: 'sm' | 'md' | 'lg' | 'full';
}

export const MobileBottomSheet = ({
  open,
  onOpenChange,
  title,
  children,
  height = 'md'
}: MobileBottomSheetProps) => {
  const getHeightClasses = () => {
    switch (height) {
      case 'sm': return 'h-1/3';
      case 'md': return 'h-1/2';
      case 'lg': return 'h-2/3';
      case 'full': return 'h-[90vh]';
      default: return 'h-1/2';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sheet */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-white rounded-t-xl border-t border-slate-200 shadow-xl",
        "animate-slide-up",
        getHeightClasses()
      )}>
        <div className="flex flex-col h-full">
          {/* Handle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-slate-300 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="px-4 pb-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MobileActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  actions: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    icon?: React.ReactNode;
  }>;
}

export const MobileActionSheet = ({
  open,
  onOpenChange,
  title,
  actions
}: MobileActionSheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Action Sheet */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <Card className="bg-white">
          <CardContent className="p-1">
            {title && (
              <div className="px-4 py-3 text-center border-b border-slate-200">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              </div>
            )}
            
            <div className="space-y-1">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 text-base font-normal touch-manipulation",
                    action.variant === 'destructive' && "text-red-600 hover:text-red-700 hover:bg-red-50"
                  )}
                  onClick={() => {
                    action.onClick();
                    onOpenChange(false);
                  }}
                >
                  {action.icon && <span className="mr-3">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Button
          variant="outline"
          className="w-full h-12 text-base font-medium bg-white touch-manipulation"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};