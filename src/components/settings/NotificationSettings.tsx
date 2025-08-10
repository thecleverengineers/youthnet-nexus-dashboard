
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Bell, Mail, Phone, Clock, Users, AlertTriangle, CheckCircle, Save } from 'lucide-react';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // Email Settings
    emailEnabled: true,
    emailDigest: 'daily',
    emailImportant: true,
    emailMarketing: false,
    
    // Push Notifications
    pushEnabled: true,
    pushMessages: true,
    pushUpdates: true,
    pushReminders: false,
    
    // SMS Settings
    smsEnabled: false,
    smsEmergency: true,
    smsReminders: false,
    
    // System Notifications
    systemAlerts: true,
    systemUpdates: true,
    systemMaintenance: true,
    
    // Timing Settings
    quietHoursEnabled: true,
    quietStart: '22:00',
    quietEnd: '08:00',
    timezone: 'Asia/Kolkata',
    
    // Alert Thresholds
    loginAttempts: 5,
    systemLoad: 80,
    diskSpace: 90,
    memoryUsage: 85,
    
    // Contact Information
    adminEmail: 'admin@youthnet.com',
    emergencyContact: '+91-9876543210',
    backupEmail: 'backup@youthnet.com',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Notification settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testNotification = (type: string) => {
    toast({
      title: `${type} Test`,
      description: `Test ${type.toLowerCase()} notification sent successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle>Email Notifications</CardTitle>
          </div>
          <CardDescription>Configure email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
            />
          </div>
          
          <Separator className="border-white/10" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailDigest">Email Digest Frequency</Label>
              <Select value={settings.emailDigest} onValueChange={(value) => setSettings({ ...settings, emailDigest: value })}>
                <SelectTrigger className="professional-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="professional-input"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Important Alerts</Label>
              <Switch
                checked={settings.emailImportant}
                onCheckedChange={(checked) => setSettings({ ...settings, emailImportant: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Marketing Emails</Label>
              <Switch
                checked={settings.emailMarketing}
                onCheckedChange={(checked) => setSettings({ ...settings, emailMarketing: checked })}
              />
            </div>
          </div>
          
          <Button variant="outline" onClick={() => testNotification('Email')}>
            <Mail className="mr-2 h-4 w-4" />
            Test Email
          </Button>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Push Notifications</CardTitle>
          </div>
          <CardDescription>Configure browser and mobile push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive real-time notifications</p>
            </div>
            <Switch
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
            />
          </div>
          
          <Separator className="border-white/10" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Direct Messages</Label>
              <Switch
                checked={settings.pushMessages}
                onCheckedChange={(checked) => setSettings({ ...settings, pushMessages: checked })}
                disabled={!settings.pushEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>System Updates</Label>
              <Switch
                checked={settings.pushUpdates}
                onCheckedChange={(checked) => setSettings({ ...settings, pushUpdates: checked })}
                disabled={!settings.pushEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Reminders</Label>
              <Switch
                checked={settings.pushReminders}
                onCheckedChange={(checked) => setSettings({ ...settings, pushReminders: checked })}
                disabled={!settings.pushEnabled}
              />
            </div>
          </div>
          
          <Button variant="outline" onClick={() => testNotification('Push')}>
            <Bell className="mr-2 h-4 w-4" />
            Test Push Notification
          </Button>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Quiet Hours</CardTitle>
          </div>
          <CardDescription>Configure when to pause non-urgent notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="font-medium">Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Suppress notifications during specified hours</p>
            </div>
            <Switch
              checked={settings.quietHoursEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, quietHoursEnabled: checked })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quietStart">Start Time</Label>
              <Input
                id="quietStart"
                type="time"
                value={settings.quietStart}
                onChange={(e) => setSettings({ ...settings, quietStart: e.target.value })}
                className="professional-input"
                disabled={!settings.quietHoursEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quietEnd">End Time</Label>
              <Input
                id="quietEnd"
                type="time"
                value={settings.quietEnd}
                onChange={(e) => setSettings({ ...settings, quietEnd: e.target.value })}
                className="professional-input"
                disabled={!settings.quietHoursEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                disabled={!settings.quietHoursEnabled}
              >
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
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Alert Thresholds</CardTitle>
          </div>
          <CardDescription>Configure system alert thresholds and triggers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Failed Login Attempts</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={settings.loginAttempts}
                onChange={(e) => setSettings({ ...settings, loginAttempts: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="systemLoad">System Load (%)</Label>
              <Input
                id="systemLoad"
                type="number"
                value={settings.systemLoad}
                onChange={(e) => setSettings({ ...settings, systemLoad: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="diskSpace">Disk Space Alert (%)</Label>
              <Input
                id="diskSpace"
                type="number"
                value={settings.diskSpace}
                onChange={(e) => setSettings({ ...settings, diskSpace: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="memoryUsage">Memory Usage Alert (%)</Label>
              <Input
                id="memoryUsage"
                type="number"
                value={settings.memoryUsage}
                onChange={(e) => setSettings({ ...settings, memoryUsage: parseInt(e.target.value) })}
                className="professional-input"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              System Monitoring Active
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              4 Active Alerts
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={loading} className="professional-button">
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
        
        <Button variant="outline">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};
