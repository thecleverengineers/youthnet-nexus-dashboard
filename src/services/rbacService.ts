import { supabase } from '@/integrations/supabase/client';

export interface SystemFeature {
  id: string;
  feature_key: string;
  feature_name: string;
  description?: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface DynamicRole {
  id: string;
  role_name: string;
  description?: string;
  is_system_role: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RoleFeature {
  id: string;
  role_id: string;
  feature_id: string;
  created_at: string;
  system_features?: SystemFeature;
}

export const rbacService = {
  // System Features Management
  async getSystemFeatures(): Promise<SystemFeature[]> {
    try {
      const { data, error } = await supabase
        .from('system_features')
        .select('*')
        .eq('is_active', true)
        .order('category, feature_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching system features:', error);
      return [];
    }
  },

  async createSystemFeature(feature: Omit<SystemFeature, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('system_features')
      .insert([feature])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSystemFeature(id: string, updates: Partial<SystemFeature>) {
    const { data, error } = await supabase
      .from('system_features')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Dynamic Roles Management
  async getDynamicRoles(): Promise<DynamicRole[]> {
    try {
      const { data, error } = await supabase
        .from('dynamic_roles')
        .select('*')
        .eq('is_active', true)
        .order('role_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching dynamic roles:', error);
      return [];
    }
  },

  async createDynamicRole(role: Omit<DynamicRole, 'id' | 'created_at' | 'updated_at'>) {
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('dynamic_roles')
      .insert([{ ...role, created_by: currentUser.data.user?.id }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDynamicRole(id: string, updates: Partial<DynamicRole>) {
    const { data, error } = await supabase
      .from('dynamic_roles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDynamicRole(id: string) {
    const { error } = await supabase
      .from('dynamic_roles')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  // Role Features Management
  async getRoleFeatures(roleId: string): Promise<RoleFeature[]> {
    try {
      const { data, error } = await supabase
        .from('role_features')
        .select('id, role_id, feature_id, created_at')
        .eq('role_id', roleId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching role features:', error);
      return [];
    }
  },

  async assignFeatureToRole(roleId: string, featureId: string) {
    const { data, error } = await supabase
      .from('role_features')
      .insert([{ role_id: roleId, feature_id: featureId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeFeatureFromRole(roleId: string, featureId: string) {
    const { error } = await supabase
      .from('role_features')
      .delete()
      .eq('role_id', roleId)
      .eq('feature_id', featureId);
    
    if (error) throw error;
  },

  // User Role Assignments Management
  async getUserRoleAssignments() {
    try {
      const { data, error } = await supabase
        .from('user_role_assignments')
        .select('*') as any;

      if (error) throw error;
      
      // Filter active assignments and ensure proper typing
      const activeAssignments = (data || []).filter((item: any) => item.is_active === true);
      return activeAssignments.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        role_id: item.role_id,
        assigned_at: item.assigned_at,
        is_active: true
      }));
    } catch (error) {
      console.error('Error fetching user role assignments:', error);
      return [];
    }
  },

  async assignRoleToUser(userId: string, roleId: string) {
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('user_role_assignments')
      .insert({ 
        user_id: userId, 
        role_id: roleId,
        assigned_by: currentUser.data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeRoleFromUser(userId: string, roleId: string) {
    const { error } = await supabase
      .from('user_role_assignments')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);
    
    if (error) throw error;
  },

  // Feature Access Check
  async checkUserFeatureAccess(userId: string, featureKey: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('user_has_feature_access', {
        user_id: userId,
        feature_key: featureKey
      });

      if (error) throw error;
      return data as boolean;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  },

  // Get all users for assignment
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};