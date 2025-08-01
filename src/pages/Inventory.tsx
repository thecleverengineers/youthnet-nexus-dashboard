
import React, { useState } from 'react';
import { Package, BarChart3, Wrench, FileText } from 'lucide-react';
import { AssetManagement } from '@/components/inventory/AssetManagement';
import { StockTracker } from '@/components/inventory/StockTracker';
import { MaintenanceScheduler } from '@/components/inventory/MaintenanceScheduler';
import { InventoryReports } from '@/components/inventory/InventoryReports';
import { MobilePageHeader, MobileTabBar } from '@/components/ui/mobile-navigation';
import { PremiumPageHeader } from '@/components/ui/premium-page-header';
import { useIsMobile } from '@/hooks/use-mobile';

export const Inventory = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const isMobile = useIsMobile();

  const tabs = [
    { key: 'assets', label: 'Assets', icon: <Package className="h-4 w-4" /> },
    { key: 'stock', label: 'Stock', icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'maintenance', label: 'Maintenance', icon: <Wrench className="h-4 w-4" /> },
    { key: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Inventory"
          subtitle="Asset & stock management"
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6">
          <PremiumPageHeader
            title="Inventory Management"
            subtitle="Track assets, stock, and maintenance schedules"
            icon={Package}
            badges={[
              { label: 'Asset Tracking', icon: Package },
              { label: 'Maintenance Hub', variant: 'secondary' as const }
            ]}
          />
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
        {activeTab === 'assets' && <AssetManagement />}
        {activeTab === 'stock' && <StockTracker />}
        {activeTab === 'maintenance' && <MaintenanceScheduler />}
        {activeTab === 'reports' && <InventoryReports />}
      </div>
    </div>
  );
};
