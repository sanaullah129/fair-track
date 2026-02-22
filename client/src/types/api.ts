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
    _id: string;
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
  _id: string;
  name: string;
  userId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
