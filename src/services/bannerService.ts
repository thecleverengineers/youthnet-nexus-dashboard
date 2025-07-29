import { supabase } from '@/integrations/supabase/client';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const bannerService = {
  async getBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data as Banner[];
  },

  async getAllBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data as Banner[];
  },

  async createBanner(banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('banners')
      .insert([{ ...banner, created_by: (await supabase.auth.getUser()).data.user?.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Banner;
  },

  async updateBanner(id: string, updates: Partial<Banner>) {
    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Banner;
  },

  async deleteBanner(id: string) {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  async reorderBanners(banners: { id: string; display_order: number }[]) {
    const updates = banners.map(banner => 
      supabase
        .from('banners')
        .update({ display_order: banner.display_order })
        .eq('id', banner.id)
    );

    const results = await Promise.all(updates);
    const errors = results.filter(result => result.error);
    
    if (errors.length > 0) {
      throw errors[0].error;
    }
  }
};