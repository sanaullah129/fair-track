import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../api/transactions";
import type { TransactionResponse, TransactionRequest } from "../types/api";
import useAuthStore from "../stores/useAuthStore";
import { useState, useEffect } from "react";

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const useTransactionsByProfile = (profileId?: string, initialPage: number = 1) => {
  const { user } = useAuthStore();
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const query = useQuery({
    queryKey: ["transactions", user?.id, profileId, pagination.page, pagination.limit],
    queryFn: () =>
      profileId && user?.id
        ? transactionApi.getByProfile(user.id, profileId, pagination.page, pagination.limit)
        : Promise.resolve({
            transactions: [],
            pagination: { page: 1, limit: 10, total: 0, pages: 0 },
          }),
    enabled: !!user?.id && !!profileId,
    gcTime: 0,
  });

  // Update pagination state when data changes
  useEffect(() => {
    if (query.data && query.data.pagination) {
      setPagination(query.data.pagination);
    }
  }, [query.data?.pagination?.page, query.data?.pagination?.limit, query.data?.pagination?.total, query.data?.pagination?.pages]);

  return {
    data: query.data?.transactions || [],
    pagination,
    isLoading: query.isLoading,
    error: query.error,
    setPage: (page: number) => setPagination((prev) => ({ ...prev, page })),
    setLimit: (limit: number) => setPagination((prev) => ({ ...prev, page: 1, limit })),
  };
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => transactionApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: TransactionRequest) => transactionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
    onError: (error: any) => {
      console.error("Create transaction error:", error);
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TransactionRequest> }) =>
      transactionApi.update(id, data),
    onSuccess: (data: TransactionResponse) => {
      queryClient.invalidateQueries({ queryKey: ["transaction", data._id] });
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
    onError: (error: any) => {
      console.error("Update transaction error:", error);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (id: string) => transactionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
    },
    onError: (error: any) => {
      console.error("Delete transaction error:", error);
    },
  });
};
