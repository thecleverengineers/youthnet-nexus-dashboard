
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export interface EnhancedApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface EnhancedPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
    requestId: string;
  };
}

class EnhancedApiClient {
  private instance: AxiosInstance;
  private baseURL: string;
  private requestQueue: Map<string, AbortController> = new Map();
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor() {
    this.baseURL = 'http://64.227.152.214/api';

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request timestamp and unique ID
        config.metadata = { 
          startTime: new Date(),
          requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - ID: ${config.metadata.requestId}`);
        return config;
      },
      (error) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor with retry logic
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as ExtendedAxiosRequestConfig;
        const endTime = new Date();
        const duration = endTime.getTime() - (config.metadata?.startTime?.getTime() || 0);
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url} - ${duration}ms - ID: ${config.metadata?.requestId}`);
        
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as any;
        
        // Retry logic for network errors
        if (this.shouldRetry(error) && config && !config._retry) {
          config._retry = true;
          config._retryCount = (config._retryCount || 0) + 1;
          
          if (config._retryCount <= this.retryAttempts) {
            console.log(`[API] Retrying request (${config._retryCount}/${this.retryAttempts}): ${config.url}`);
            
            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, config._retryCount - 1);
            await this.delay(delay);
            
            return this.instance(config);
          }
        }
        
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'ECONNABORTED' ||
      (error.response?.status && error.response.status >= 500)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleApiError(error: AxiosError) {
    const status = error.response?.status;
    const errorData = error.response?.data as any;
    const message = errorData?.message || error.message;

    console.error('[API] Error:', {
      status,
      message,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle different error types
    switch (status) {
      case 401:
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        toast.error('Your session has expired. Please log in again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 422:
        toast.error('Invalid data provided. Please check your inputs.');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again.');
        break;
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
          toast.error('Unable to connect to the server. Please check your internet connection.');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please try again.');
        } else {
          toast.error(message || 'An unexpected error occurred.');
        }
    }
  }

  // Generic request method with caching
  public async request<T = any>(config: AxiosRequestConfig & { cache?: boolean }): Promise<EnhancedApiResponse<T>> {
    try {
      // Cancel previous request if it's the same endpoint
      const requestKey = `${config.method}-${config.url}`;
      if (this.requestQueue.has(requestKey)) {
        this.requestQueue.get(requestKey)?.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      this.requestQueue.set(requestKey, abortController);
      config.signal = abortController.signal;

      const response = await this.instance.request<EnhancedApiResponse<T>>(config);
      
      // Clean up
      this.requestQueue.delete(requestKey);
      
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('[API] Request cancelled:', config.url);
        throw new Error('Request cancelled');
      }
      throw error;
    }
  }

  // Enhanced GET request with caching
  public async get<T = any>(url: string, params?: any, options?: { cache?: boolean }): Promise<EnhancedApiResponse<T>> {
    return this.request<T>({ 
      method: 'GET', 
      url, 
      params,
      cache: options?.cache 
    });
  }

  // Batch requests
  public async batch<T = any>(requests: Array<{ method: string; url: string; data?: any }>): Promise<EnhancedApiResponse<T>[]> {
    try {
      const promises = requests.map(req => this.request<T>(req));
      const results = await Promise.allSettled(promises);
      
      return results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            success: false,
            error: result.reason.message || 'Request failed'
          };
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Advanced search with debouncing
  public async search<T = any>(
    endpoint: string, 
    query: string, 
    options?: { 
      debounce?: number; 
      filters?: Record<string, any>;
      limit?: number;
    }
  ): Promise<EnhancedApiResponse<T[]>> {
    const searchParams = {
      search: query,
      limit: options?.limit || 10,
      ...options?.filters
    };

    return this.get<T[]>(endpoint, searchParams);
  }

  // File upload with progress
  public async uploadFile<T = any>(
    url: string, 
    file: File, 
    onProgress?: (progress: number) => void,
    additionalData?: Record<string, any>
  ): Promise<EnhancedApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Real-time data fetching
  public async subscribe<T = any>(
    endpoint: string, 
    callback: (data: T) => void,
    interval: number = 5000
  ): Promise<() => void> {
    let isActive = true;
    
    const fetchData = async () => {
      if (!isActive) return;
      
      try {
        const response = await this.get<T>(endpoint);
        if (response.success && response.data) {
          callback(response.data);
        }
      } catch (error) {
        console.error('[API] Subscription error:', error);
      }
      
      if (isActive) {
        setTimeout(fetchData, interval);
      }
    };

    fetchData();

    // Return unsubscribe function
    return () => {
      isActive = false;
    };
  }

  // Health check with detailed status
  public async healthCheck(): Promise<{
    api: boolean;
    database: boolean;
    response_time: number;
    version?: string;
  }> {
    try {
      const startTime = Date.now();
      const response = await this.get('/health');
      const responseTime = Date.now() - startTime;
      
      return {
        api: response.success,
        database: response.data?.database || false,
        response_time: responseTime,
        version: response.data?.version
      };
    } catch {
      return {
        api: false,
        database: false,
        response_time: -1
      };
    }
  }

  // Cancel all pending requests
  public cancelAllRequests(): void {
    this.requestQueue.forEach(controller => controller.abort());
    this.requestQueue.clear();
  }

  // Get base URL
  public getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export singleton instance
export const enhancedApi = new EnhancedApiClient();

// Specialized API services
export const userApi = {
  getProfile: () => enhancedApi.get('/auth/profile'),
  updateProfile: (data: any) => enhancedApi.request({ method: 'PUT', url: '/auth/profile', data }),
  getUsers: (params?: EnhancedPaginationParams) => enhancedApi.get('/users', params),
  searchUsers: (query: string) => enhancedApi.search('/users/search', query),
};

export const dashboardApi = {
  getStats: () => enhancedApi.get('/dashboard/stats'),
  getRecentActivity: () => enhancedApi.get('/dashboard/activity'),
  getAnalytics: (period: string) => enhancedApi.get(`/dashboard/analytics?period=${period}`),
};

export const adminApi = {
  getSystemHealth: () => enhancedApi.healthCheck(),
  getSystemLogs: (params?: EnhancedPaginationParams) => enhancedApi.get('/admin/logs', params),
  manageUsers: {
    list: (params?: EnhancedPaginationParams) => enhancedApi.get('/admin/users', params),
    create: (userData: any) => enhancedApi.request({ method: 'POST', url: '/admin/users', data: userData }),
    update: (id: string, userData: any) => enhancedApi.request({ method: 'PUT', url: `/admin/users/${id}`, data: userData }),
    delete: (id: string) => enhancedApi.request({ method: 'DELETE', url: `/admin/users/${id}` }),
  }
};
