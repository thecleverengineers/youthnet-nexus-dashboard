
import React, { useState } from 'react';
import { Package, Users, Award, BarChart3 } from 'lucide-react';
import { ProductCatalog } from '@/components/made-in-nagaland/ProductCatalog';
import { ProducerManagement } from '@/components/made-in-nagaland/ProducerManagement';
import { CertificationTracker } from '@/components/made-in-nagaland/CertificationTracker';
import { MarketplaceAnalytics } from '@/components/made-in-nagaland/MarketplaceAnalytics';
import { ArtisanManagement } from '@/components/made-in-nagaland/ArtisanManagement';
import { MobilePageHeader, MobileTabBar } from '@/components/ui/mobile-navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const MadeInNagaland = () => {
  const [activeTab, setActiveTab] = useState('products');
  const isMobile = useIsMobile();

  const tabs = [
    { key: 'products', label: 'Products', icon: <Package className="h-4 w-4" /> },
    { key: 'producers', label: 'Producers', icon: <Users className="h-4 w-4" /> },
    { key: 'certification', label: 'Certificates', icon: <Award className="h-4 w-4" /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <MobilePageHeader
          title="Made in Nagaland"
          subtitle="Local products & producers"
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold">Made in Nagaland</h1>
          <p className="text-muted-foreground mt-2">Promote and manage local products and producers</p>
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
        {activeTab === 'products' && <ProductCatalog />}
        {activeTab === 'producers' && (
          <div className="space-y-6">
            <ProducerManagement />
            <ArtisanManagement />
          </div>
        )}
        {activeTab === 'certification' && <CertificationTracker />}
        {activeTab === 'analytics' && <MarketplaceAnalytics />}
      </div>
    </div>
  );
};
