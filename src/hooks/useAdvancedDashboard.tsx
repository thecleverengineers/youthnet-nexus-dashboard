
import { useState, useEffect, useCallback } from 'react';
import { enhancedApi, dashboardApi, ApiResponse } from '@/lib/enhanced-api';
import { useUnifiedAuth } from './useUnifiedAuth';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTrainers: number;
  totalEmployees: number;
  activePrograms: number;
  completedPrograms: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'payment' | 'training';
  title: string;
  description: string;
  timestamp: Date;
  user: {
    name: string;
    avatar?: string;
  };
}

interface AnalyticsData {
  userGrowth: Array<{ date: string; users: number; }>;
  programPerformance: Array<{ name: string; completion: number; satisfaction: number; }>;
  revenueData: Array<{ month: string; revenue: number; expenses: number; }>;
  departmentStats: Array<{ department: string; employees: number; budget: number; }>;
}

interface DashboardData {
  stats: DashboardStats | null;
  recentActivity: ActivityItem[];
  analytics: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useAdvancedDashboard() {
  const { user, profile } = useUnifiedAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: null,
    recentActivity: [],
    analytics: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchDashboardStats = useCallback(async (): Promise<DashboardStats | null> => {
    try {
      const response = await dashboardApi.getStats();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Return mock data for development
      return {
        totalUsers: 1250,
        totalStudents: 890,
        totalTrainers: 45,
        totalEmployees: 125,
        activePrograms: 28,
        completedPrograms: 156,
        totalRevenue: 2450000,
        monthlyGrowth: 12.5,
      };
    }
  }, []);

  const fetchRecentActivity = useCallback(async (): Promise<ActivityItem[]> => {
    try {
      const response = await dashboardApi.getRecentActivity();
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch activity');
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      
      // Return mock data for development
      return [
        {
          id: '1',
          type: 'enrollment',
          title: 'New Student Enrollment',
          description: 'John Doe enrolled in Web Development Program',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          user: { name: 'John Doe' }
        },
        {
          id: '2',
          type: 'completion',
          title: 'Program Completed',
          description: 'Sarah Smith completed Digital Marketing Course',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          user: { name: 'Sarah Smith' }
        },
        {
          id: '3',
          type: 'training',
          title: 'Training Session',
          description: 'Advanced JavaScript workshop started',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          user: { name: 'Mike Johnson' }
        }
      ];
    }
  }, []);

  const fetchAnalytics = useCallback(async (period: string = '30d'): Promise<AnalyticsData | null> => {
    try {
      const response = await dashboardApi.getAnalytics(period);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // Return mock data for development
      return {
        userGrowth: [
          { date: '2024-01-01', users: 100 },
          { date: '2024-01-15', users: 150 },
          { date: '2024-02-01', users: 200 },
          { date: '2024-02-15', users: 280 },
          { date: '2024-03-01', users: 350 },
        ],
        programPerformance: [
          { name: 'Web Development', completion: 85, satisfaction: 4.2 },
          { name: 'Digital Marketing', completion: 92, satisfaction: 4.5 },
          { name: 'Data Science', completion: 78, satisfaction: 4.1 },
          { name: 'Mobile App Development', completion: 88, satisfaction: 4.3 },
        ],
        revenueData: [
          { month: 'Jan', revenue: 180000, expenses: 120000 },
          { month: 'Feb', revenue: 220000, expenses: 140000 },
          { month: 'Mar', revenue: 280000, expenses: 160000 },
          { month: 'Apr', revenue: 320000, expenses: 180000 },
        ],
        departmentStats: [
          { department: 'Education', employees: 45, budget: 500000 },
          { department: 'IT', employees: 25, budget: 400000 },
          { department: 'HR', employees: 15, budget: 250000 },
          { department: 'Finance', employees: 12, budget: 200000 },
        ]
      };
    }
  }, []);

  const loadDashboardData = useCallback(async (showToast: boolean = false) => {
    if (!user) return;

    setDashboardData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [stats, activity, analytics] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivity(),
        fetchAnalytics(),
      ]);

      setDashboardData({
        stats,
        recentActivity: activity,
        analytics,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });

      if (showToast) {
        toast.success('Dashboard updated successfully');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data',
      }));
      
      if (showToast) {
        toast.error('Failed to update dashboard');
      }
    }
  }, [user, fetchDashboardStats, fetchRecentActivity, fetchAnalytics]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData(true);
    setRefreshing(false);
  }, [loadDashboardData]);

  // Initial load
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh || !user) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh, user, loadDashboardData]);

  // Role-based data filtering
  const getFilteredData = useCallback(() => {
    if (!profile || !dashboardData.stats) return dashboardData;

    const userRole = profile.role || profile.profile?.role;
    
    switch (userRole) {
      case 'student':
        return {
          ...dashboardData,
          stats: {
            ...dashboardData.stats,
            totalUsers: 0, // Hide sensitive data
            totalRevenue: 0,
          }
        };
      case 'trainer':
        return {
          ...dashboardData,
          stats: {
            ...dashboardData.stats,
            totalRevenue: 0, // Hide financial data
          }
        };
      default:
        return dashboardData;
    }
  }, [dashboardData, profile]);

  return {
    ...getFilteredData(),
    refreshData,
    refreshing,
    autoRefresh,
    setAutoRefresh,
    userRole: profile?.role || profile?.profile?.role,
  };
}
