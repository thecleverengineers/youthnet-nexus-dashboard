import { supabase } from '@/integrations/supabase/client';

export interface InventoryCategory {
  id: string;
  category_name: string;
  description?: string;
  parent_category_id?: string;
  depreciation_rate: number;
  maintenance_frequency_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  location?: string;
  purchase_date?: string;
  purchase_price?: number;
  current_value?: number;
  status: 'available' | 'in_use' | 'maintenance' | 'damaged' | 'disposed';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  category_details?: InventoryCategory;
}

export const inventoryService = {
  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('inventory_categories')
      .select('*')
      .eq('is_active', true)
      .order('category_name');

    if (error) throw error;
    return data as InventoryCategory[];
  },

  async createCategory(category: Omit<InventoryCategory, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('inventory_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data as InventoryCategory;
  },

  // Items
  async getItems() {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as any[];
  },

  async createItem(item: any) {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([item])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateItem(id: string, updates: any) {
    const { data, error } = await supabase
      .from('inventory_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteItem(id: string) {
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};