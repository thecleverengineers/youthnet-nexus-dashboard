import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to employee_tasks changes
    const tasksChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employee_tasks'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['employee-tasks'] });
        }
      )
      .subscribe();

    // Subscribe to inventory_items changes
    const inventoryChannel = supabase
      .channel('inventory-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['inventory-category-data'] });
          queryClient.invalidateQueries({ queryKey: ['inventory-monthly-data'] });
        }
      )
      .subscribe();

    // Subscribe to job_applications changes
    const jobsChannel = supabase
      .channel('jobs-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['placement-monthly-data'] });
        }
      )
      .subscribe();

    // Subscribe to reports changes
    const reportsChannel = supabase
      .channel('reports-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['reports'] });
          queryClient.invalidateQueries({ queryKey: ['inventory-reports'] });
        }
      )
      .subscribe();

    // Subscribe to skill assessments and certifications
    const skillsChannel = supabase
      .channel('skills-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'skill_assessments'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['skill-assessments'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'certifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['certifications'] });
        }
      )
      .subscribe();

    // Subscribe to training programs
    const trainingChannel = supabase
      .channel('training-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'training_programs'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['training-programs'] });
        }
      )
      .subscribe();

    // Subscribe to notifications (handled by useNotifications hook)
    // This subscription is primarily for cache invalidation
    const notificationsChannel = supabase
      .channel('notifications-cache-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(reportsChannel);
      supabase.removeChannel(skillsChannel);
      supabase.removeChannel(trainingChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [queryClient]);
};