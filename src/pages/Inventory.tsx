
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetManagement } from '@/components/inventory/AssetManagement';
import { StockTracker } from '@/components/inventory/StockTracker';
import { MaintenanceScheduler } from '@/components/inventory/MaintenanceScheduler';
import { InventoryReports } from '@/components/inventory/InventoryReports';

export const Inventory = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-2">Track assets, stock, and maintenance schedules</p>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">Asset Management</TabsTrigger>
          <TabsTrigger value="stock">Stock Tracker</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <AssetManagement />
        </TabsContent>

        <TabsContent value="stock">
          <StockTracker />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceScheduler />
        </TabsContent>

        <TabsContent value="reports">
          <InventoryReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};
