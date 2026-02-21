import { API_CONFIG } from "./config";

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export class ApiErrorClass extends Error implements ApiError {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

// Note: requests include credentials (cookies) via fetch option `credentials: "include"`

export async function fetchAPI<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...requestOptions } = options;

  // Build URL with query params
  let url = `${API_CONFIG.baseURL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Build headers
  const headers: HeadersInit = {
    ...API_CONFIG.headers,
    ...(requestOptions.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers,
      credentials: "include", // Include cookies in request
    });

    // Handle response
    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiErrorClass(
        data?.message || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiErrorClass) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiErrorClass("Network error. Please check your connection.", 0, error);
    }

    throw new ApiErrorClass(
      error instanceof Error ? error.message : "Unknown error occurred",
      0,
      error
    );
  }
}

export const apiClient = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: "DELETE" }),
};
