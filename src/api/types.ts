export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  access_time: number;
  refresh_time: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}
