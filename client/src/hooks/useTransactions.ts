import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../api/transactions";
import type { TransactionResponse, TransactionRequest } from "../types/api";
import useAuthStore from "../stores/useAuthStore";

export const useTransactionsByUser = () => {
  const { user } = useAuthStore();

  return useQuery<TransactionResponse[]>({
    queryKey: ["transactions", user?.id],
    queryFn: () => transactionApi.getByUser(user!.id),
    enabled: !!user?.id,
    gcTime: 0,
  });
};

export const useTransactionsByProfile = (profileId?: string) => {
  const { user } = useAuthStore();

  return useQuery<TransactionResponse[]>({
    queryKey: ["transactions", user?.id, profileId],
    queryFn: () =>
      profileId && user?.id
        ? transactionApi.getByProfile(user.id, profileId)
        : Promise.resolve([]),
    enabled: !!user?.id && !!profileId,
    gcTime: 0,
  });
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
