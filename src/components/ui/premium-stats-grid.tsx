import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PremiumStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  className?: string;
}

export const PremiumStatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  className 
}: PremiumStatsCardProps) => {
  return (
    <Card className={cn("premium-card hover-lift scale-in border-0 bg-gradient-to-br from-background to-primary/5", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 neon-glow-blue">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gradient-primary mb-1">
          {value}
        </div>
        {change && (
          <p className={cn(
            "text-xs font-medium",
            change.type === 'increase' && "text-green-500",
            change.type === 'decrease' && "text-red-500",
            change.type === 'neutral' && "text-muted-foreground"
          )}>
            {change.value}
          </p>
        )}
        
        {/* Animated progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
            style={{ width: '75%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface PremiumStatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const PremiumStatsGrid = ({ 
  children, 
  columns = 4,
  className 
}: PremiumStatsGridProps) => {
  return (
    <div 
      className={cn(
        "grid gap-6 mb-6",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
};