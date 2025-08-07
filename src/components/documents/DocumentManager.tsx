import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Settings, BarChart3, Eye, Download, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import { DocumentCategories } from './DocumentCategories';
import { DocumentAnalytics } from './DocumentAnalytics';

export function DocumentManager() {
  const [activeTab, setActiveTab] = useState('documents');

  // Mock document statistics for now
  const stats = {
    totalDocuments: 0,
    totalCategories: 3,
    totalSize: '0.00',
    recentUploads: 0
  };
  const statsLoading = false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage your documents
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Documents</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats?.totalDocuments || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats?.totalCategories || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Storage Used</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : `${stats?.totalSize || 0} MB`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Recent Uploads</p>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats?.recentUploads || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <DocumentList />
        </TabsContent>

        <TabsContent value="upload">
          <DocumentUpload />
        </TabsContent>

        <TabsContent value="categories">
          <DocumentCategories />
        </TabsContent>

        <TabsContent value="analytics">
          <DocumentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}