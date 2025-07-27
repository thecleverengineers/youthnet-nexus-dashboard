import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search, Filter, SortAsc, X } from 'lucide-react';

interface MobileFilterOption {
  key: string;
  label: string;
  value: string;
  count?: number;
}

interface MobileFilterGroup {
  key: string;
  label: string;
  options: MobileFilterOption[];
  multiSelect?: boolean;
}

interface MobileSearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterGroups?: MobileFilterGroup[];
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (key: string, values: string[]) => void;
  sortOptions?: Array<{ key: string; label: string }>;
  activeSortKey?: string;
  onSortChange?: (key: string) => void;
  className?: string;
}

export const MobileSearchAndFilter = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterGroups = [],
  activeFilters = {},
  onFilterChange,
  sortOptions = [],
  activeSortKey,
  onSortChange,
  className
}: MobileSearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const activeFilterCount = Object.values(activeFilters).flat().length;

  const handleFilterToggle = (groupKey: string, optionValue: string) => {
    if (!onFilterChange) return;
    
    const currentValues = activeFilters[groupKey] || [];
    const group = filterGroups.find(g => g.key === groupKey);
    
    if (group?.multiSelect) {
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];
      onFilterChange(groupKey, newValues);
    } else {
      const newValues = currentValues.includes(optionValue) ? [] : [optionValue];
      onFilterChange(groupKey, newValues);
    }
  };

  const clearAllFilters = () => {
    if (!onFilterChange) return;
    filterGroups.forEach(group => {
      onFilterChange(group.key, []);
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 text-base touch-manipulation"
        />
      </div>

      {/* Filter & Sort Controls */}
      <div className="flex gap-2">
        {filterGroups.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 px-3 touch-manipulation relative"
          >
            <Filter className="h-4 w-4 mr-1.5" />
            Filter
            {activeFilterCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}

        {sortOptions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSort(!showSort)}
            className="h-9 px-3 touch-manipulation"
          >
            <SortAsc className="h-4 w-4 mr-1.5" />
            Sort
          </Button>
        )}

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-9 px-3 text-muted-foreground touch-manipulation"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterGroups.map(group => 
            (activeFilters[group.key] || []).map(value => {
              const option = group.options.find(opt => opt.value === value);
              return (
                <Badge
                  key={`${group.key}-${value}`}
                  variant="secondary"
                  className="text-xs px-2 py-1 flex items-center gap-1"
                >
                  {option?.label || value}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleFilterToggle(group.key, value)}
                  />
                </Badge>
              );
            })
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-4">
            {filterGroups.map(group => (
              <div key={group.key}>
                <h4 className="text-sm font-medium text-foreground mb-2">{group.label}</h4>
                <div className="space-y-2">
                  {group.options.map(option => {
                    const isActive = (activeFilters[group.key] || []).includes(option.value);
                    return (
                      <Button
                        key={option.value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterToggle(group.key, option.value)}
                        className="w-full justify-between h-9 text-sm touch-manipulation"
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {option.count}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Sort Panel */}
      {showSort && (
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Sort by</h4>
            <div className="space-y-2">
              {sortOptions.map(option => (
                <Button
                  key={option.key}
                  variant={activeSortKey === option.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    onSortChange?.(option.key);
                    setShowSort(false);
                  }}
                  className="w-full justify-start h-9 text-sm touch-manipulation"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};