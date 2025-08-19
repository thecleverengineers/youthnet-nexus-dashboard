
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  className 
}: StatsCardProps) => {
  return (
    <Card className={cn("glass-card hover-lift group transition-all duration-300", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-2 truncate">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gradient group-hover:scale-105 transition-transform">
              {value}
            </p>
          </div>
          {Icon && (
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </div>
          )}
        </div>
        {change && (
          <div className="mt-4">
            <span className={cn(
              "text-xs px-2 py-1 rounded-md font-medium",
              changeType === 'positive' && "bg-green-500/20 text-green-400 border border-green-500/30",
              changeType === 'negative' && "bg-red-500/20 text-red-400 border border-red-500/30",
              changeType === 'neutral' && "bg-blue-500/20 text-blue-400 border border-blue-500/30"
            )}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
