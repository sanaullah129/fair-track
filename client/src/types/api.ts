export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ProfileModel {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
