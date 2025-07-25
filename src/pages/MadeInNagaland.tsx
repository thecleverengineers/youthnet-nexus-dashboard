
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCatalog } from '@/components/made-in-nagaland/ProductCatalog';
import { ProducerManagement } from '@/components/made-in-nagaland/ProducerManagement';
import { CertificationTracker } from '@/components/made-in-nagaland/CertificationTracker';
import { MarketplaceAnalytics } from '@/components/made-in-nagaland/MarketplaceAnalytics';
import { ArtisanManagement } from '@/components/made-in-nagaland/ArtisanManagement';

export const MadeInNagaland = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Made in Nagaland</h1>
        <p className="text-gray-600 mt-2">Promote and manage local products and producers</p>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">Product Catalog</TabsTrigger>
          <TabsTrigger value="producers">Producers</TabsTrigger>
          <TabsTrigger value="certification">Certification</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductCatalog />
        </TabsContent>

        <TabsContent value="producers">
          <div className="space-y-6">
            <ProducerManagement />
            <ArtisanManagement />
          </div>
        </TabsContent>

        <TabsContent value="certification">
          <CertificationTracker />
        </TabsContent>

        <TabsContent value="analytics">
          <MarketplaceAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
