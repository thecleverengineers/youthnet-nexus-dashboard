
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  className 
}: StatsCardProps) => {
  return (
    <Card className={cn("futuristic-card hover-lift scale-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 neon-glow-blue">
          <Icon className="h-4 w-4 text-blue-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gradient mb-1">
          {value}
        </div>
        <p className={cn(
          "text-xs font-medium",
          changeType === 'positive' && "text-green-400",
          changeType === 'negative' && "text-red-400",
          changeType === 'neutral' && "text-muted-foreground"
        )}>
          {change}
        </p>
        
        {/* Animated progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
            style={{ width: '75%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
