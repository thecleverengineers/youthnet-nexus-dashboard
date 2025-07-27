import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Palette, 
  Bell, 
  Globe, 
  Monitor, 
  Moon, 
  Sun, 
  Settings, 
  Save,
  Mail,
  Smartphone,
  Volume2,
  Eye
} from 'lucide-react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  dashboard: {
    compactMode: boolean;
    showAnimations: boolean;
    defaultView: string;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'limited';
    showOnlineStatus: boolean;
  };
}

export const Preferences = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      desktop: false,
      sound: true,
    },
    dashboard: {
      compactMode: false,
      showAnimations: true,
      defaultView: 'overview',
    },
    privacy: {
      profileVisibility: 'limited',
      showOnlineStatus: true,
    },
  });

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', `user_preferences_${user.id}`)
        .single();

      if (data && data.setting_value) {
        const savedPrefs = data.setting_value as any;
        setPreferences({ ...preferences, ...savedPrefs });
      }
    } catch (error) {
      console.log('No existing preferences found, using defaults');
    }
  };

  const savePreferences = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: `user_preferences_${user.id}`,
          setting_value: preferences as any,
          setting_type: 'user_preference',
          description: 'User personal preferences'
        });

      if (error) throw error;

      toast({
        title: 'Preferences Saved',
        description: 'Your preferences have been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (path: string, value: any) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = path.split('.');
      let current: any = newPrefs;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newPrefs;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Preferences</h1>
        <p className="text-muted-foreground">Customize your experience and interface settings</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select 
              value={preferences.theme} 
              onValueChange={(value: any) => updatePreference('theme', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => updatePreference('language', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="as">Assamese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => updatePreference('notifications.email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
            </div>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(checked) => updatePreference('notifications.push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <div>
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show desktop notifications</p>
              </div>
            </div>
            <Switch
              checked={preferences.notifications.desktop}
              onCheckedChange={(checked) => updatePreference('notifications.desktop', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <div>
                <Label>Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
              </div>
            </div>
            <Switch
              checked={preferences.notifications.sound}
              onCheckedChange={(checked) => updatePreference('notifications.sound', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Use compact layout for more content</p>
            </div>
            <Switch
              checked={preferences.dashboard.compactMode}
              onCheckedChange={(checked) => updatePreference('dashboard.compactMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Animations</Label>
              <p className="text-sm text-muted-foreground">Enable interface animations</p>
            </div>
            <Switch
              checked={preferences.dashboard.showAnimations}
              onCheckedChange={(checked) => updatePreference('dashboard.showAnimations', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Default View</Label>
              <p className="text-sm text-muted-foreground">Default dashboard view</p>
            </div>
            <Select 
              value={preferences.dashboard.defaultView} 
              onValueChange={(value) => updatePreference('dashboard.defaultView', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="tasks">Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Who can see your profile</p>
            </div>
            <Select 
              value={preferences.privacy.profileVisibility} 
              onValueChange={(value: any) => updatePreference('privacy.profileVisibility', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Online Status</Label>
              <p className="text-sm text-muted-foreground">Display when you're online</p>
            </div>
            <Switch
              checked={preferences.privacy.showOnlineStatus}
              onCheckedChange={(checked) => updatePreference('privacy.showOnlineStatus', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};