import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumTab {
  key: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
}

interface PremiumTabsProps {
  tabs: PremiumTab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const PremiumTabs = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className
}: PremiumTabsProps) => {
  return (
    <Tabs 
      defaultValue={defaultValue || tabs[0]?.key} 
      value={value}
      onValueChange={onValueChange}
      className={cn("space-y-6", className)}
    >
      <div className="premium-card border-0 bg-gradient-to-r from-background to-primary/5 p-1 rounded-xl">
        <TabsList className={cn(
          "w-full h-auto p-1 bg-transparent",
          tabs.length <= 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "flex flex-wrap"
        )}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className={cn(
                "flex-1 min-w-0 px-4 py-3 text-sm font-medium transition-all duration-200",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary",
                "data-[state=active]:text-white data-[state=active]:shadow-lg",
                "hover:bg-primary/10 rounded-lg"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                {tab.icon && <tab.icon className="h-4 w-4 flex-shrink-0" />}
                <span className="truncate">{tab.label}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="space-y-6 fade-in">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};