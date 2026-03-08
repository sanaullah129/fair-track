import { apiClient } from "./client";
import type { TransactionRequest, TransactionResponse } from "../types/api";

export const transactionApi = {
  create: async (data: TransactionRequest): Promise<TransactionResponse> => {
    const response = await apiClient.post<{
      message: string;
      transaction: TransactionResponse;
    }>("/transaction", data);
    return response.transaction;
  },

  getById: async (id: string): Promise<TransactionResponse> => {
    const response = await apiClient.get<{
      message: string;
      transaction: TransactionResponse;
    }>(`/transaction/${id}`);
    return response.transaction;
  },

  getByUser: async (
    userId: string,
    profileId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    transactions: TransactionResponse[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> => {
    const response = await apiClient.get<{
      message: string;
      transactions: TransactionResponse[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/transaction/user/${userId}/${profileId}`, {
      params: { page, limit },
    });
    return {
      transactions: response.transactions || [],
      pagination: response.pagination,
    };
  },

  getByProfile: async (
    userId: string,
    profileId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    transactions: TransactionResponse[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> => {
    return transactionApi.getByUser(userId, profileId, page, limit);
  },

  getByDateRange: async (
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<TransactionResponse[]> => {
    const response = await apiClient.get<{
      message: string;
      transactions: TransactionResponse[];
    }>(`/transaction/user/date-range`, {
      params: { userId, startDate, endDate },
    });
    return response.transactions || [];
  },

  getByCategory: async (
    userId: string,
    categoryId: string
  ): Promise<TransactionResponse[]> => {
    const response = await apiClient.get<{
      message: string;
      transactions: TransactionResponse[];
    }>(`/transaction/user/${userId}/category/${categoryId}`);
    return response.transactions || [];
  },

  getByType: async (userId: string, type: string): Promise<TransactionResponse[]> => {
    const response = await apiClient.get<{
      message: string;
      transactions: TransactionResponse[];
    }>(`/transaction/user/${userId}/type/${type}`);
    return response.transactions || [];
  },

  update: async (
    id: string,
    data: Partial<TransactionRequest>
  ): Promise<TransactionResponse> => {
    const response = await apiClient.put<{
      message: string;
      transaction: TransactionResponse;
    }>(`/transaction/${id}`, data);
    return response.transaction;
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/transaction/${id}`);
  },
};
