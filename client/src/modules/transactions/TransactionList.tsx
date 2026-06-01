import {
  Box,
  Typography,
  Divider,
  Stack,
  Skeleton,
  Pagination,
  Paper,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useTransactionsByProfile, useDeleteTransaction } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { formatCurrency } from "./helpers/helperFunc";
import type { TransactionResponse } from "../../types/api";
import SummaryBar from "./SummaryBar";
import TransactionRow from "./TransactionRow";
import TransactionForm from "./TransactionForm";

interface TransactionListProps {
  profileId?: string;
}

const TransactionList = ({ profileId }: TransactionListProps) => {
  const {
    data: transactions = [],
    pagination,
    isLoading,
    error,
    setPage,
  } = useTransactionsByProfile(profileId);
  const { deleteTransaction, isLoading: isDeleting } = useDeleteTransaction(profileId);
  const { data: categories = [] } = useCategories();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionResponse | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionResponse | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const isMobile = useMediaQuery('(max-width:600px)');

  if (isLoading) {
    return (
      <Stack spacing={{ xs: 1, sm: 1.5 }} mt={{ xs: 1, sm: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={isMobile?  48: 56 } />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: { xs: 3, sm: 6 }, color: "error.main" }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Failed to load transactions.</Typography>
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box sx={{ textAlign: "center", py: { xs: 3, sm: 6 }, color: "text.secondary" }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>No transactions found.</Typography>
      </Box>
    );
  }

  // Build category map for quick lookup
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat) => {
    categoryMap[cat._id] = cat.name;
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  }

  const handleDeleteClick = (transaction: TransactionResponse) => {
    setTransactionToDelete(transaction);
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) {
      return;
    }

    try {
      await deleteTransaction(transactionToDelete._id);
      setConfirmOpen(false);
      setTransactionToDelete(null);
      setSnackbar({
        open: true,
        message: "Transaction deleted successfully!",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to delete transaction",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditClick = (transaction: TransactionResponse) => {
    setEditingTransaction(transaction);
  };

  const handleEditSuccess = () => {
    setEditingTransaction(null);
    setSnackbar({
      open: true,
      message: "Transaction updated successfully!",
      severity: "success",
    });
  };

  const handleEditError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  return (
    <Box mt={{ xs: 1, sm: 2 }}>
      <SummaryBar transactions={transactions} />
      <Stack divider={<Divider flexItem />} spacing={0}>
        {transactions.map((tx) => (
          <TransactionRow
            key={tx._id}
            tx={tx}
            categoryMap={categoryMap}
            onDelete={() => handleDeleteClick(tx)}
            onEdit={handleEditClick}
            isDeleting={isDeleting && transactionToDelete?._id === tx._id}
          />
        ))}
      </Stack>

      <Dialog open={confirmOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Delete Transaction
        </DialogTitle>
        <DialogContent sx={{ pt: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          <Typography sx={{ mb: 1 }}>
            Are you sure you want to delete this transaction?
          </Typography>
          {transactionToDelete && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Amount: {formatCurrency(transactionToDelete.amount)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Category: {categoryMap[transactionToDelete.category] ?? transactionToDelete.category}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 1.5, sm: 2 }, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <TransactionForm
        open={Boolean(editingTransaction)}
        onClose={() => setEditingTransaction(null)}
        profileId={editingTransaction?.profileId ?? profileId ?? ""}
        transaction={editingTransaction}
        onSuccess={handleEditSuccess}
        onError={handleEditError}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
            mt: { xs: 1.5, sm: 2 },
            backgroundColor: "background.paper",
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Page {pagination.page} of {pagination.pages} | Total: {pagination.total}
          </Typography>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            size="small"
          />
        </Paper>
      )}
    </Box>
  );
};

export default TransactionList;
