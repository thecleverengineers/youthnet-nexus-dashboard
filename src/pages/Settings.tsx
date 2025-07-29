
import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Users, Bell, Database, Image } from 'lucide-react';
import { SystemConfiguration } from '@/components/settings/SystemConfiguration';
import { UserPermissions } from '@/components/settings/UserPermissions';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { BackupRestore } from '@/components/settings/BackupRestore';
import { LandingPageManagement } from '@/components/settings/LandingPageManagement';
import { BannerManagement } from '@/components/admin/BannerManagement';
import { MobilePageHeader, MobileTabBar } from '@/components/ui/mobile-navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const isMobile = useIsMobile();

  const tabs = [
    { key: 'system', label: 'System', icon: <SettingsIcon className="h-4 w-4" /> },
    { key: 'landing', label: 'Landing', icon: <Globe className="h-4 w-4" /> },
    { key: 'banners', label: 'Banners', icon: <Image className="h-4 w-4" /> },
    { key: 'permissions', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { key: 'notifications', label: 'Alerts', icon: <Bell className="h-4 w-4" /> },
    { key: 'backup', label: 'Backup', icon: <Database className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Settings"
          subtitle="System configuration"
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-2">Configure system preferences and manage user access</p>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="sticky top-16 z-20 bg-background border-b border-border p-4">
          <MobileTabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="px-6">
          <div className="flex border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-6">
        {activeTab === 'system' && <SystemConfiguration />}
        {activeTab === 'landing' && <LandingPageManagement />}
        {activeTab === 'banners' && <BannerManagement />}
        {activeTab === 'permissions' && <UserPermissions />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'backup' && <BackupRestore />}
      </div>
    </div>
  );
};
