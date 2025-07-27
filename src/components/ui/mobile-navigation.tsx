import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, MoreVertical, Share, Star } from 'lucide-react';

interface MobilePageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
}

export const MobilePageHeader = ({
  title,
  subtitle,
  onBack,
  actions,
  showBackButton = false,
  className
}: MobilePageHeaderProps) => (
  <div className={cn(
    "sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-3",
    className
  )}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 w-9 p-0 touch-manipulation"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  </div>
);

interface MobileTabBarProps {
  tabs: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
  }>;
  activeTab: string;
  onTabChange: (key: string) => void;
  variant?: 'default' | 'icons' | 'minimal';
  className?: string;
}

export const MobileTabBar = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className
}: MobileTabBarProps) => {
  const getTabClasses = (isActive: boolean) => {
    const baseClasses = "flex-1 flex flex-col items-center justify-center py-2 px-1 touch-manipulation transition-colors";
    
    if (variant === 'minimal') {
      return cn(
        baseClasses,
        isActive 
          ? "text-primary border-b-2 border-primary" 
          : "text-muted-foreground hover:text-foreground"
      );
    }
    
    return cn(
      baseClasses,
      "rounded-lg",
      isActive 
        ? "bg-primary text-primary-foreground shadow-sm" 
        : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
    );
  };

  return (
    <div className={cn(
      "flex gap-1 p-1 bg-white border border-slate-200 rounded-xl",
      variant === 'minimal' && "bg-transparent border-0 border-b border-slate-200 rounded-none",
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={getTabClasses(activeTab === tab.key)}
        >
          {tab.icon && (
            <div className="relative">
              {tab.icon}
              {tab.badge && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
          )}
          <span className={cn(
            "text-xs font-medium mt-1",
            variant === 'icons' && tab.icon && "sr-only"
          )}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

interface MobileFloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  className?: string;
}

export const MobileFloatingActionButton = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  position = 'bottom-right',
  className
}: MobileFloatingActionButtonProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-center': return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-left': return 'bottom-6 left-6';
      default: return 'bottom-6 right-6';
    }
  };

  return (
    <Button
      onClick={onClick}
      size={label ? "default" : "icon"}
      variant={variant === 'primary' ? "default" : "secondary"}
      className={cn(
        "fixed z-40 shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation",
        label ? "rounded-full h-12 px-4" : "rounded-full h-12 w-12",
        getPositionClasses(),
        className
      )}
    >
      {icon}
      {label && <span className="ml-2 text-sm font-medium">{label}</span>}
    </Button>
  );
};

interface MobileToolbarProps {
  children: React.ReactNode;
  variant?: 'default' | 'minimal';
  className?: string;
}

export const MobileToolbar = ({
  children,
  variant = 'default',
  className
}: MobileToolbarProps) => (
  <div className={cn(
    "flex items-center gap-2 p-3 bg-white border-t border-slate-200",
    variant === 'minimal' && "bg-transparent border-0 p-2",
    className
  )}>
    {children}
  </div>
);