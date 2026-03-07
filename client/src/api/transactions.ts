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

  getByUser: async (userId: string): Promise<TransactionResponse[]> => {
    const response = await apiClient.get<{
      message: string;
      transactions: TransactionResponse[];
    }>(`/transaction/user/${userId}`);
    return response.transactions || [];
  },

  getByProfile: async (userId: string, profileId: string): Promise<TransactionResponse[]> => {
    // Get all transactions for user, then filter by profile
    const allTransactions = await transactionApi.getByUser(userId);
    return allTransactions.filter((t) => t.profileId === profileId);
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
