import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface LandingPageContent {
  id: string;
  content_key: string;
  content_value: any;
  content_type: string;
  is_active: boolean;
}

export const LandingPageManagement = () => {
  const [content, setContent] = useState<LandingPageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('landing_page_content')
        .select('*')
        .order('content_key');

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load landing page content');
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (key: string, value: any) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('landing_page_content')
        .update({ 
          content_value: typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value),
          updated_at: new Date().toISOString()
        })
        .eq('content_key', key);

      if (error) throw error;
      
      toast.success('Content updated successfully');
      await fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setSaving(true);
      
      // Create a unique filename
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      // For now, we'll just store the file name. In production, you'd upload to storage
      const logoUrl = `/uploads/${fileName}`;
      
      await updateContent('logo_url', logoUrl);
      toast.success('Logo updated successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setSaving(false);
    }
  };

  const toggleContentVisibility = async (key: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('landing_page_content')
        .update({ is_active: !currentStatus })
        .eq('content_key', key);

      if (error) throw error;
      
      toast.success(`Content ${!currentStatus ? 'enabled' : 'disabled'}`);
      await fetchContent();
    } catch (error) {
      console.error('Error toggling content:', error);
      toast.error('Failed to update content visibility');
    }
  };

  const getContentValue = (item: LandingPageContent) => {
    try {
      return typeof item.content_value === 'string' 
        ? JSON.parse(item.content_value) 
        : item.content_value;
    } catch {
      return item.content_value;
    }
  };

  const renderContentEditor = (item: LandingPageContent) => {
    const value = getContentValue(item);
    
    if (item.content_type === 'array') {
      return (
        <div className="space-y-4">
          <Label>{item.content_key.replace(/_/g, ' ').toUpperCase()}</Label>
          <Textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateContent(item.content_key, parsed);
              } catch {
                // Invalid JSON, don't update yet
              }
            }}
            className="min-h-[200px] font-mono text-sm"
            placeholder="Enter valid JSON array..."
          />
        </div>
      );
    }

    if (item.content_key.includes('description') || item.content_key.includes('bio')) {
      return (
        <div className="space-y-2">
          <Label>{item.content_key.replace(/_/g, ' ').toUpperCase()}</Label>
          <Textarea
            value={value}
            onChange={(e) => updateContent(item.content_key, e.target.value)}
            placeholder="Enter description..."
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label>{item.content_key.replace(/_/g, ' ').toUpperCase()}</Label>
        <Input
          value={value}
          onChange={(e) => updateContent(item.content_key, e.target.value)}
          placeholder="Enter text..."
        />
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading landing page content...</div>
        </CardContent>
      </Card>
    );
  }

  const textContent = content.filter(item => item.content_type === 'text');
  const arrayContent = content.filter(item => item.content_type === 'array');
  const imageContent = content.filter(item => item.content_type === 'image');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Landing Page Management</h2>
          <p className="text-muted-foreground">Customize your landing page content and appearance</p>
        </div>
      </div>

      <Tabs defaultValue="text" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="text">Text Content</TabsTrigger>
          <TabsTrigger value="images">Images & Logo</TabsTrigger>
          <TabsTrigger value="features">Features & Stats</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <div className="grid gap-4">
            {textContent.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {item.content_key.replace(/_/g, ' ').toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleContentVisibility(item.content_key, item.is_active)}
                      >
                        {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderContentEditor(item)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload New Logo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button onClick={handleLogoUpload} disabled={saving || !logoFile}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              
              {imageContent.map((item) => (
                <div key={item.id} className="space-y-2">
                  <Label>Current Logo URL</Label>
                  <Input
                    value={getContentValue(item)}
                    onChange={(e) => updateContent(item.content_key, e.target.value)}
                    placeholder="Enter logo URL..."
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4">
            {arrayContent.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{item.content_key.replace(/_/g, ' ').toUpperCase()}</CardTitle>
                    <Badge variant={item.is_active ? 'default' : 'secondary'}>
                      {item.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderContentEditor(item)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Landing Page Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Preview your changes by visiting the main page in a new tab
                </p>
                <Button asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    Open Landing Page
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};