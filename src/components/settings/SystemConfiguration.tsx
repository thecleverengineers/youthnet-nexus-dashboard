
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Save, RefreshCw, Database, Shield, Clock, Globe } from 'lucide-react';

export const SystemConfiguration = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // System Settings State
  const [config, setConfig] = useState({
    systemName: 'YouthNet MIS',
    version: '2.0.0',
    environment: 'production',
    timezone: 'Asia/Kolkata',
    language: 'en',
    theme: 'dark',
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: 30,
    maxFileSize: 50,
    allowedFileTypes: 'pdf,doc,docx,jpg,png,xlsx',
    emailHost: 'smtp.gmail.com',
    emailPort: 587,
    emailSecure: true,
    debugMode: false,
    logLevel: 'info',
    cacheEnabled: true,
    compressionEnabled: true,
    apiRateLimit: 1000,
    description: 'Youth Network Management Information System for skill development and career guidance.',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configuration Saved",
        description: "System configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig({
      ...config,
      systemName: 'YouthNet MIS',
      environment: 'production',
      maintenanceMode: false,
      debugMode: false,
    });
    
    toast({
      title: "Configuration Reset",
      description: "System configuration has been reset to defaults.",
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>Basic system configuration and branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={config.systemName}
                onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={config.version}
                onChange={(e) => setConfig({ ...config, version: e.target.value })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select value={config.environment} onValueChange={(value) => setConfig({ ...config, environment: value })}>
                <SelectTrigger className="professional-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={config.timezone} onValueChange={(value) => setConfig({ ...config, timezone: value })}>
                <SelectTrigger className="professional-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">System Description</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="professional-input min-h-[80px]"
              placeholder="Describe your system..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>Configure security and access controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={config.sessionTimeout}
                onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
              <Input
                id="apiRateLimit"
                type="number"
                value={config.apiRateLimit}
                onChange={(e) => setConfig({ ...config, apiRateLimit: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenanceMode"
              checked={config.maintenanceMode}
              onCheckedChange={(checked) => setConfig({ ...config, maintenanceMode: checked })}
            />
            <Label htmlFor="maintenanceMode" className="flex items-center gap-2">
              Maintenance Mode
              {config.maintenanceMode && <Badge variant="destructive">Active</Badge>}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* File Settings */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>File & Storage Settings</CardTitle>
          </div>
          <CardDescription>Configure file upload and storage settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={config.maxFileSize}
                onChange={(e) => setConfig({ ...config, maxFileSize: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
              <Input
                id="allowedFileTypes"
                value={config.allowedFileTypes}
                onChange={(e) => setConfig({ ...config, allowedFileTypes: e.target.value })}
                className="professional-input"
                placeholder="pdf,doc,docx,jpg,png"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="autoBackup"
              checked={config.autoBackup}
              onCheckedChange={(checked) => setConfig({ ...config, autoBackup: checked })}
            />
            <Label htmlFor="autoBackup">Enable Automatic Backups</Label>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Advanced Settings</CardTitle>
          </div>
          <CardDescription>Advanced system configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logLevel">Log Level</Label>
              <Select value={config.logLevel} onValueChange={(value) => setConfig({ ...config, logLevel: value })}>
                <SelectTrigger className="professional-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="debugMode"
                checked={config.debugMode}
                onCheckedChange={(checked) => setConfig({ ...config, debugMode: checked })}
              />
              <Label htmlFor="debugMode" className="flex items-center gap-2">
                Debug Mode
                {config.debugMode && <Badge variant="outline">Enabled</Badge>}
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="cacheEnabled"
                checked={config.cacheEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, cacheEnabled: checked })}
              />
              <Label htmlFor="cacheEnabled">Enable Caching</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="compressionEnabled"
                checked={config.compressionEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, compressionEnabled: checked })}
              />
              <Label htmlFor="compressionEnabled">Enable Compression</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={loading} className="professional-button">
          {loading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Configuration
        </Button>
        
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};
