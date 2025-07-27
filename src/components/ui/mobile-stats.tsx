import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MobileStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const MobileStatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className
}: MobileStatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getChangeColor = () => {
    switch (change?.type) {
      case 'increase': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'decrease': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <Badge 
                variant="outline" 
                className={cn("text-xs mt-2 border", getChangeColor())}
              >
                {change.value}
              </Badge>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50",
              getTrendColor()
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MobileStatsGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const MobileStatsGrid = ({ 
  children, 
  columns = 2, 
  className 
}: MobileStatsGridProps) => {
  const getGridClass = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2';
    }
  };

  return (
    <div className={cn(
      "grid gap-4",
      getGridClass(),
      className
    )}>
      {children}
    </div>
  );
};

interface MobileProgressCardProps {
  title: string;
  current: number;
  total: number;
  unit?: string;
  description?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

export const MobileProgressCard = ({
  title,
  current,
  total,
  unit = '',
  description,
  color = 'blue',
  className
}: MobileProgressCardProps) => {
  const percentage = Math.round((current / total) * 100);
  
  const getColorClasses = () => {
    switch (color) {
      case 'green': return { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'red': return { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700' };
      case 'yellow': return { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700' };
      case 'purple': return { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700' };
      default: return { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700' };
    }
  };

  const colors = getColorClasses();

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <span className="text-xs text-muted-foreground">{percentage}%</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">
                {current.toLocaleString()}{unit}
              </span>
              <span className="text-sm text-muted-foreground">
                / {total.toLocaleString()}{unit}
              </span>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className={cn("h-2 rounded-full transition-all duration-300", colors.bg)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};