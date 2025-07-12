import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

export interface ApiResponse<T = any> {
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

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

interface RequestMetadata {
  requestId: string;
  startTime: number;
}

// Extend the AxiosRequestConfig to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: RequestMetadata;
  }
}

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://143.244.171.76:5000/api'; // Production DigitalOcean droplet IP and port

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
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add request metadata for performance monitoring
        const requestId = Date.now().toString(36) + '-' + Math.random().toString(36).substr(2);
        config.metadata = { requestId, startTime: Date.now() };
        
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0);
        console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        
        return response;
      },
      (error: AxiosError) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
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
        localStorage.removeItem('authToken');
        window.location.href = '/';
        toast({
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again.',
          variant: 'destructive',
        });
        break;
      case 403:
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to perform this action.',
          variant: 'destructive',
        });
        break;
      case 404:
        toast({
          title: 'Not Found',
          description: 'The requested resource was not found.',
          variant: 'destructive',
        });
        break;
      case 429:
        toast({
          title: 'Rate Limited',
          description: 'Too many requests. Please try again later.',
          variant: 'destructive',
        });
        break;
      case 500:
        toast({
          title: 'Server Error',
          description: 'An internal server error occurred. Please try again.',
          variant: 'destructive',
        });
        break;
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to the server. Please check your internet connection.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
        }
    }
  }

  // Generic request method
  public async request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.request<ApiResponse<T>>(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET request
  public async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }

  // POST request
  public async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data });
  }

  // PUT request
  public async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  // PATCH request
  public async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data });
  }

  // DELETE request
  public async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }

  // File upload
  public async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

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

  // Paginated GET request
  public async getPaginated<T = any>(url: string, params?: PaginationParams): Promise<ApiResponse<T[]>> {
    const queryParams = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search,
      sort: params?.sort,
      order: params?.order || 'desc',
      ...params?.filters,
    };

    return this.get<T[]>(url, queryParams);
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch {
      return false;
    }
  }

  // Get base URL
  public getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export types for convenience
export type { AxiosRequestConfig, AxiosResponse, AxiosError };
