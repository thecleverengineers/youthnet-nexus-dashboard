import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileTableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface MobileTableProps {
  data: any[];
  columns: MobileTableColumn[];
  keyField: string;
  actions?: (row: any) => React.ReactNode;
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  className?: string;
}

export const MobileTable = ({
  data,
  columns,
  keyField,
  actions,
  onRowClick,
  emptyMessage = "No data available",
  className
}: MobileTableProps) => {
  if (data.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((row) => (
        <Card 
          key={row[keyField]} 
          className={cn(
            "transition-all duration-200 hover:shadow-md border border-slate-200 bg-white",
            onRowClick && "cursor-pointer hover:border-primary/50"
          )}
          onClick={() => onRowClick?.(row)}
        >
          <CardContent className="p-4 space-y-3">
            {/* Primary Information */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {columns.slice(0, 2).map((column) => (
                  <div key={column.key} className="mb-1">
                    {column.render ? (
                      <div className={column.className}>
                        {column.render(row[column.key], row)}
                      </div>
                    ) : (
                      <div className={cn(
                        "text-sm",
                        column.key === columns[0].key ? "font-semibold text-foreground" : "text-muted-foreground",
                        column.className
                      )}>
                        {row[column.key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              {actions && (
                <div className="flex gap-1 flex-shrink-0">
                  {actions(row)}
                </div>
              )}
            </div>

            {/* Secondary Information */}
            {columns.length > 2 && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                {columns.slice(2).map((column) => (
                  <div key={column.key} className="min-w-0">
                    <div className="text-xs text-muted-foreground font-medium mb-1">
                      {column.label}
                    </div>
                    {column.render ? (
                      <div className={column.className}>
                        {column.render(row[column.key], row)}
                      </div>
                    ) : (
                      <div className={cn("text-sm text-foreground truncate", column.className)}>
                        {row[column.key] || '-'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Mobile-optimized table header
export const MobileTableHeader = ({ 
  title, 
  subtitle, 
  actions 
}: { 
  title: string; 
  subtitle?: string; 
  actions?: React.ReactNode; 
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {actions && (
      <div className="flex gap-2 flex-wrap">
        {actions}
      </div>
    )}
  </div>
);

// Mobile-optimized status badge
export const MobileStatusBadge = ({ 
  status, 
  variant = "default" 
}: { 
  status: string; 
  variant?: "default" | "secondary" | "destructive" | "outline"; 
}) => (
  <Badge variant={variant} className="text-xs px-2 py-1 font-medium">
    {status}
  </Badge>
);