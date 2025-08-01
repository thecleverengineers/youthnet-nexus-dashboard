import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PremiumPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    icon?: LucideIcon;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export const PremiumPageHeader = ({
  title,
  subtitle,
  icon: Icon,
  badges = [],
  actions,
  className
}: PremiumPageHeaderProps) => {
  return (
    <div className={cn("premium-card p-6 mb-6 border-0 bg-gradient-to-br from-background via-background to-primary/5", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 neon-glow-blue">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gradient-primary mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-base text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {badges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant={badge.variant || 'default'}
                  className="gradient-bg-primary text-white border-0 px-3 py-1"
                >
                  {badge.icon && <badge.icon className="h-3 w-3 mr-1" />}
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};