
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Video, Download, Search, Eye } from 'lucide-react';

export function CareerResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources] = useState([
    {
      id: 1,
      title: 'Resume Building Guide',
      type: 'document',
      category: 'Job Search',
      description: 'Comprehensive guide to creating professional resumes',
      downloads: 245,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Interview Skills Masterclass',
      type: 'video',
      category: 'Interview Prep',
      description: 'Video series covering common interview questions and techniques',
      downloads: 189,
      rating: 4.9
    },
    {
      id: 3,
      title: 'Networking Strategies',
      type: 'ebook',
      category: 'Professional Development',
      description: 'Effective networking strategies for career advancement',
      downloads: 156,
      rating: 4.6
    },
    {
      id: 4,
      title: 'Salary Negotiation Tips',
      type: 'document',
      category: 'Career Advancement',
      description: 'Guide to negotiating salary and benefits effectively',
      downloads: 203,
      rating: 4.7
    }
  ]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'ebook': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Career Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-muted rounded">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {resource.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {resource.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>{resource.downloads} downloads</span>
                <span>★ {resource.rating}</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`/preview/${resource.id}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    // Create a download link
                    const link = document.createElement('a');
                    link.href = `/download/${resource.id}`;
                    link.download = `${resource.title}.pdf`;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
