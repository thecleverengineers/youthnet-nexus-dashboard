import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Save, Settings2, Mail, Shield } from 'lucide-react';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
  is_public: boolean;
}

export const SystemConfiguration = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [organizationSettings, setOrganizationSettings] = useState({
    organization_name: '',
    organization_email: '',
    organization_phone: '',
    organization_address: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    max_file_size: '',
    session_timeout: '',
    backup_retention_days: '',
    email_notifications_enabled: false
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchSettings();
    }
  }, [profile]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_type', { ascending: true });

      if (error) throw error;

      setSettings(data || []);
      
      // Parse settings into state
      data?.forEach((setting) => {
        const value = typeof setting.setting_value === 'string' 
          ? JSON.parse(setting.setting_value) 
          : setting.setting_value;

        if (setting.setting_type === 'general') {
          setOrganizationSettings(prev => ({
            ...prev,
            [setting.setting_key]: value
          }));
        } else if (setting.setting_type === 'system' || setting.setting_type === 'notifications') {
          setSystemSettings(prev => ({
            ...prev,
            [setting.setting_key]: value
          }));
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: JSON.stringify(value),
          updated_by: profile?.id 
        })
        .eq('setting_key', key);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const handleSaveOrganizationSettings = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(organizationSettings).map(([key, value]) =>
        updateSetting(key, value)
      );
      
      await Promise.all(promises);
      toast.success('Organization settings updated successfully');
    } catch (error) {
      toast.error('Failed to update organization settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(systemSettings).map(([key, value]) =>
        updateSetting(key, value)
      );
      
      await Promise.all(promises);
      toast.success('System settings updated successfully');
    } catch (error) {
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Access denied. Admin privileges required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading system settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Organization Information
          </CardTitle>
          <CardDescription>Configure basic organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={organizationSettings.organization_name}
                onChange={(e) => setOrganizationSettings(prev => ({
                  ...prev,
                  organization_name: e.target.value
                }))}
                placeholder="Enter organization name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-email">Contact Email</Label>
              <Input
                id="org-email"
                type="email"
                value={organizationSettings.organization_email}
                onChange={(e) => setOrganizationSettings(prev => ({
                  ...prev,
                  organization_email: e.target.value
                }))}
                placeholder="Enter contact email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org-phone">Contact Phone</Label>
              <Input
                id="org-phone"
                value={organizationSettings.organization_phone}
                onChange={(e) => setOrganizationSettings(prev => ({
                  ...prev,
                  organization_phone: e.target.value
                }))}
                placeholder="Enter contact phone"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-address">Address</Label>
            <Textarea
              id="org-address"
              value={organizationSettings.organization_address}
              onChange={(e) => setOrganizationSettings(prev => ({
                ...prev,
                organization_address: e.target.value
              }))}
              placeholder="Enter organization address"
              rows={3}
            />
          </div>
          <Button 
            onClick={handleSaveOrganizationSettings} 
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Organization Settings
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <CardDescription>Configure system behavior and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-file-size">Max File Size (bytes)</Label>
              <Input
                id="max-file-size"
                type="number"
                value={systemSettings.max_file_size}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  max_file_size: e.target.value
                }))}
                placeholder="10485760"
              />
              <p className="text-sm text-muted-foreground">Current: 10MB</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (seconds)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={systemSettings.session_timeout}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  session_timeout: e.target.value
                }))}
                placeholder="3600"
              />
              <p className="text-sm text-muted-foreground">Current: 1 hour</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-retention">Backup Retention (days)</Label>
              <Input
                id="backup-retention"
                type="number"
                value={systemSettings.backup_retention_days}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev,
                  backup_retention_days: e.target.value
                }))}
                placeholder="30"
              />
              <p className="text-sm text-muted-foreground">Current: 30 days</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable system-wide email notifications
              </p>
            </div>
            <Switch
              checked={systemSettings.email_notifications_enabled}
              onCheckedChange={(checked) => setSystemSettings(prev => ({
                ...prev,
                email_notifications_enabled: checked
              }))}
            />
          </div>
          
          <Button 
            onClick={handleSaveSystemSettings} 
            disabled={saving}
            className="w-full md:w-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save System Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};