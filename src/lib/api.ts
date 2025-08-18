import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from '@/types/auth';

class ApiClient {
  private client: AxiosInstance;
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        this.setToken(response.data.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', response.data.data.refreshToken);
          localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
        }
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion',
        errors: error.response?.data?.errors,
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/register', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'inscription',
        errors: error.response?.data?.errors,
      };
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email',
        errors: error.response?.data?.errors,
      };
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la réinitialisation',
        errors: error.response?.data?.errors,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      if (!refreshToken) return null;

      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/refresh', {
        refreshToken,
      });

      if (response.data.success && response.data.data) {
        this.setToken(response.data.data.token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refresh_token', response.data.data.refreshToken);
          localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
        }
      }

      return response.data;
    } catch (error) {
      this.clearToken();
      return null;
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.client.post('/auth/verify-email', { token });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la vérification',
        errors: error.response?.data?.errors,
      };
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;

