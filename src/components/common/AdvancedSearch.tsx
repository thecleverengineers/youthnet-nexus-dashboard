import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  User, 
  FileText, 
  Building2,
  Calendar,
  Tag,
  TrendingUp,
  Zap
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  description: string;
  category: string;
  relevance: number;
  lastModified: string;
  author?: string;
  tags: string[];
}

interface AdvancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string, filters: any) => void;
  categories?: string[];
}

export const AdvancedSearch = ({ 
  placeholder = "Search across all modules...", 
  onSearch,
  categories = ['All', 'Documents', 'Employees', 'Programs', 'Reports', 'Tasks']
}: AdvancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
    category: 'All',
    dateRange: 'any',
    author: '',
    tags: []
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    {
      id: '1',
      title: 'Employee Onboarding Document',
      type: 'document',
      description: 'Complete guide for new employee onboarding process',
      category: 'HR',
      relevance: 95,
      lastModified: '2024-01-20',
      author: 'HR Department',
      tags: ['onboarding', 'process', 'guide']
    },
    {
      id: '2',
      title: 'Q4 Performance Report',
      type: 'report',
      description: 'Quarterly performance analysis and metrics',
      category: 'Analytics',
      relevance: 88,
      lastModified: '2024-01-18',
      author: 'Analytics Team',
      tags: ['performance', 'quarterly', 'metrics']
    },
    {
      id: '3',
      title: 'John Doe - Software Engineer',
      type: 'employee',
      description: 'Senior Software Engineer in Development Team',
      category: 'Employees',
      relevance: 82,
      lastModified: '2024-01-15',
      tags: ['engineering', 'senior', 'development']
    }
  ]);

  const [recentSearches] = useState([
    'employee performance',
    'training programs',
    'budget reports',
    'attendance records'
  ]);

  const [popularTags] = useState([
    'urgent', 'reports', 'training', 'budget', 'performance', 'development'
  ]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim() || Object.values(activeFilters).some(filter => filter && filter !== 'All' && filter !== 'any')) {
      // Simulate search - in real app, this would call an API
      console.log('Searching for:', searchQuery, 'with filters:', activeFilters);
      onSearch?.(searchQuery, activeFilters);
      setIsOpen(true);
    }
  };

  const clearFilters = () => {
    setActiveFilters({
      category: 'All',
      dateRange: 'any',
      author: '',
      tags: []
    });
  };

  const removeTag = (tagToRemove: string) => {
    setActiveFilters({
      ...activeFilters,
      tags: activeFilters.tags.filter((tag: string) => tag !== tagToRemove)
    });
  };

  const addTag = (tag: string) => {
    if (!activeFilters.tags.includes(tag)) {
      setActiveFilters({
        ...activeFilters,
        tags: [...activeFilters.tags, tag]
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      case 'report':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return 'text-green-400';
    if (relevance >= 70) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 bg-white/5 border-white/20 text-white placeholder:text-muted-foreground"
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={activeFilters.category} onValueChange={(value) => setActiveFilters({...activeFilters, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Date Range</label>
                  <Select value={activeFilters.dateRange} onValueChange={(value) => setActiveFilters({...activeFilters, dateRange: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="month">This month</SelectItem>
                      <SelectItem value="quarter">This quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input
                    value={activeFilters.author}
                    onChange={(e) => setActiveFilters({...activeFilters, author: e.target.value})}
                    placeholder="Filter by author..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {activeFilters.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {popularTags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-white/10"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={clearFilters}>Clear</Button>
                  <Button onClick={() => handleSearch()}>Apply Filters</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            size="sm" 
            onClick={() => handleSearch()}
            className="h-8 px-3"
          >
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(activeFilters.category !== 'All' || activeFilters.dateRange !== 'any' || activeFilters.author || activeFilters.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeFilters.category !== 'All' && (
            <Badge variant="secondary" className="text-xs">
              Category: {activeFilters.category}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setActiveFilters({...activeFilters, category: 'All'})} />
            </Badge>
          )}
          {activeFilters.dateRange !== 'any' && (
            <Badge variant="secondary" className="text-xs">
              Date: {activeFilters.dateRange}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setActiveFilters({...activeFilters, dateRange: 'any'})} />
            </Badge>
          )}
          {activeFilters.author && (
            <Badge variant="secondary" className="text-xs">
              Author: {activeFilters.author}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setActiveFilters({...activeFilters, author: ''})} />
            </Badge>
          )}
          {activeFilters.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Search Results */}
      {isOpen && query && (
        <Card className="mt-4 glass-card border-white/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Search Results</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div key={result.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(result.type)}
                        <h3 className="font-semibold">{result.title}</h3>
                        <Badge variant="outline" className="text-xs">{result.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {result.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {result.author}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.lastModified}
                        </div>
                        <div className={`flex items-center gap-1 ${getRelevanceColor(result.relevance)}`}>
                          <TrendingUp className="h-3 w-3" />
                          {result.relevance}% match
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {!isOpen && !query && (
        <Card className="mt-4 glass-card border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-white/10"
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};