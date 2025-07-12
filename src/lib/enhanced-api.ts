
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

interface HealthCheckResponse {
  api: boolean;
  database: boolean;
  response_time: number;
  timestamp: string;
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

class EnhancedApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Use environment-appropriate base URL
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'http://64.227.152.214' // Updated with your DigitalOcean droplet IP
      : 'http://localhost:5000'; // Local development
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const requestId = Date.now().toString(36) + '-' + Math.random().toString(36).substr(2);
        config.metadata = { requestId, startTime: Date.now() };
        
        console.info(`[API] ${config.method?.toUpperCase()} ${config.url} - ID: ${requestId}`);
        
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0);
        console.info(`[API] Response received in ${duration}ms - ID: ${response.config.metadata?.requestId}`);
        return response;
      },
      (error) => {
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleApiError(error: any) {
    const requestId = error.config?.metadata?.requestId;
    const method = error.config?.method;
    const url = error.config?.url;

    let errorDetails = {
      status: error.response?.status,
      message: error.message,
      url,
      method
    };

    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      errorDetails.message = 'Unable to connect to server. Please check if the backend is running.';
    } else if (error.code === 'ECONNABORTED') {
      errorDetails.message = 'Request timeout. The server is taking too long to respond.';
    }

    console.error('[API] Error:', errorDetails);
    
    // Throw a standardized error
    throw {
      ...errorDetails,
      isApiError: true
    };
  }

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.request(config);
      
      if (response.data.success === false) {
        throw new Error(response.data.message || 'API request failed');
      }
      
      return response.data.data as T || response.data as T;
    } catch (error: any) {
      if (error.isApiError) {
        throw error;
      }
      throw {
        status: error.response?.status,
        message: error.message || 'Unknown error occurred',
        isApiError: true
      };
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Health check endpoint
  async healthCheck(): Promise<HealthCheckResponse> {
    try {
      const startTime = Date.now();
      const response = await this.get('/health');
      const endTime = Date.now();
      
      return {
        api: true,
        database: response.database || true,
        response_time: endTime - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        api: false,
        database: false,
        response_time: -1,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get base URL for debugging
  getBaseURL(): string {
    return this.baseURL;
  }

  // Check if backend is reachable
  async checkConnection(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.api;
    } catch {
      return false;
    }
  }
}

// Create dashboard-specific API methods
class DashboardApiClient {
  constructor(private apiClient: EnhancedApiClient) {}

  async getStats() {
    return this.apiClient.get('/api/dashboard/stats');
  }

  async getRecentActivity() {
    return this.apiClient.get('/api/dashboard/activity');
  }

  async getAnalytics(period: string = '30d') {
    return this.apiClient.get(`/api/dashboard/analytics?period=${period}`);
  }
}

export const enhancedApi = new EnhancedApiClient();
export const dashboardApi = new DashboardApiClient(enhancedApi);
export type EnhancedApiResponse<T = any> = ApiResponse<T>;
