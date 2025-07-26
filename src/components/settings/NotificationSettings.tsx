import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Bell, Mail, MessageSquare, Save, Users, AlertCircle } from 'lucide-react';

interface NotificationSetting {
  id: string;
  user_id: string;
  setting_type: string;
  notification_type: string;
  is_enabled: boolean;
  delivery_method: string[];
  created_at: string;
  updated_at: string;
}

export const NotificationSettings = () => {
  const { profile } = useAuth();
  const [userSettings, setUserSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const notificationTypes = [
    {
      type: 'account',
      name: 'Account Activities',
      description: 'Login, password changes, profile updates',
      notifications: [
        { key: 'login_alert', name: 'Login Alerts', description: 'Notify when account is accessed' },
        { key: 'password_change', name: 'Password Changes', description: 'Notify when password is changed' },
        { key: 'profile_update', name: 'Profile Updates', description: 'Notify when profile is modified' }
      ]
    },
    {
      type: 'training',
      name: 'Training & Courses',
      description: 'Course enrollments, completions, deadlines',
      notifications: [
        { key: 'enrollment_confirmation', name: 'Enrollment Confirmations', description: 'Notify when enrolled in courses' },
        { key: 'course_deadline', name: 'Course Deadlines', description: 'Remind about upcoming deadlines' },
        { key: 'completion_certificate', name: 'Completion Certificates', description: 'Notify when certificates are available' }
      ]
    },
    {
      type: 'job_placement',
      name: 'Job & Placement',
      description: 'Job opportunities, interview schedules, placement updates',
      notifications: [
        { key: 'job_match', name: 'Job Matches', description: 'Notify about matching job opportunities' },
        { key: 'interview_schedule', name: 'Interview Schedules', description: 'Notify about interview appointments' },
        { key: 'placement_update', name: 'Placement Updates', description: 'Updates on placement status' }
      ]
    },
    {
      type: 'system',
      name: 'System Notifications',
      description: 'System maintenance, updates, announcements',
      notifications: [
        { key: 'maintenance_alert', name: 'Maintenance Alerts', description: 'Notify about system maintenance' },
        { key: 'feature_announcement', name: 'Feature Announcements', description: 'Notify about new features' },
        { key: 'security_alert', name: 'Security Alerts', description: 'Important security notifications' }
      ]
    }
  ];

  useEffect(() => {
    if (profile?.id) {
      fetchNotificationSettings();
    }
  }, [profile]);

  const fetchNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', profile?.id)
        .order('setting_type', { ascending: true });

      if (error) throw error;

      setUserSettings(data || []);
      
      // Create default settings if none exist
      if (!data || data.length === 0) {
        await createDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    try {
      const defaultSettings: Omit<NotificationSetting, 'id' | 'created_at' | 'updated_at'>[] = [];
      
      notificationTypes.forEach(category => {
        category.notifications.forEach(notification => {
          defaultSettings.push({
            user_id: profile?.id || '',
            setting_type: category.type,
            notification_type: notification.key,
            is_enabled: true,
            delivery_method: ['email']
          });
        });
      });

      const { error } = await supabase
        .from('notification_settings')
        .insert(defaultSettings);

      if (error) throw error;
      
      await fetchNotificationSettings();
    } catch (error) {
      console.error('Error creating default settings:', error);
    }
  };

  const updateNotificationSetting = async (settingType: string, notificationType: string, isEnabled: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: profile?.id,
          setting_type: settingType,
          notification_type: notificationType,
          is_enabled: isEnabled,
          delivery_method: ['email']
        }, {
          onConflict: 'user_id,setting_type,notification_type'
        });

      if (error) throw error;

      // Update local state
      setUserSettings(prev => {
        const updated = [...prev];
        const existingIndex = updated.findIndex(
          s => s.setting_type === settingType && s.notification_type === notificationType
        );
        
        if (existingIndex >= 0) {
          updated[existingIndex] = { ...updated[existingIndex], is_enabled: isEnabled };
        } else {
          updated.push({
            id: `temp-${Date.now()}`,
            user_id: profile?.id || '',
            setting_type: settingType,
            notification_type: notificationType,
            is_enabled: isEnabled,
            delivery_method: ['email'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        return updated;
      });

      toast.success('Notification setting updated');
    } catch (error) {
      console.error('Error updating notification setting:', error);
      toast.error('Failed to update notification setting');
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (settingType: string, notificationType: string): boolean => {
    const setting = userSettings.find(
      s => s.setting_type === settingType && s.notification_type === notificationType
    );
    return setting?.is_enabled ?? true;
  };

  const getDeliveryMethods = (settingType: string, notificationType: string): string[] => {
    const setting = userSettings.find(
      s => s.setting_type === settingType && s.notification_type === notificationType
    );
    return setting?.delivery_method ?? ['email'];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading notification settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications from the system
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Notification Categories */}
      {notificationTypes.map((category, categoryIndex) => (
        <Card key={category.type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {category.type === 'account' && <Users className="h-5 w-5" />}
              {category.type === 'training' && <AlertCircle className="h-5 w-5" />}
              {category.type === 'job_placement' && <MessageSquare className="h-5 w-5" />}
              {category.type === 'system' && <Mail className="h-5 w-5" />}
              {category.name}
            </CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notification Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Delivery Method</TableHead>
                  <TableHead className="text-right">Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.notifications.map((notification) => (
                  <TableRow key={notification.key}>
                    <TableCell className="font-medium">{notification.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {notification.description}
                    </TableCell>
                    <TableCell>
                      {getDeliveryMethods(category.type, notification.key).map(method => (
                        <Badge key={method} variant="outline" className="mr-1">
                          {method === 'email' && <Mail className="h-3 w-3 mr-1" />}
                          {method === 'sms' && <MessageSquare className="h-3 w-3 mr-1" />}
                          {method.charAt(0).toUpperCase() + method.slice(1)}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={getSettingValue(category.type, notification.key)}
                        onCheckedChange={(checked) => 
                          updateNotificationSetting(category.type, notification.key, checked)
                        }
                        disabled={saving}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Global Settings for Admins */}
      {profile?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Global Notification Settings
            </CardTitle>
            <CardDescription>
              System-wide notification configuration (Admin Only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Service Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Global email notification system
                  </p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600 mr-2" />
                  Active
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Service Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Global SMS notification system
                  </p>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  <div className="w-2 h-2 rounded-full bg-orange-600 mr-2" />
                  Not Configured
                </Badge>
              </div>
              
              <Separator />
              
              <div className="text-sm text-muted-foreground">
                <p>To configure SMS notifications, please contact your system administrator.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};