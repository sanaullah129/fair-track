import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { useCreateTransaction, useUpdateTransaction } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import useAuthStore from "../../stores/useAuthStore";
import type { TransactionRequest, TransactionResponse } from "../../types/api";
import { TransactionType } from "../../types/api";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  transaction?: TransactionResponse | null;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const getInitialFormData = (transaction?: TransactionResponse) => {
  if (transaction) {
    const dateValue = transaction.date ? new Date(transaction.date) : new Date();
    const formattedDate = isNaN(dateValue.getTime())
      ? new Date().toISOString().slice(0, 16)
      : dateValue.toISOString().slice(0, 16);

    return {
      amount: transaction.amount,
      type: transaction.type,
      date: formattedDate,
      category: transaction.category,
      note: transaction.note || "",
    } as Partial<TransactionRequest>;
  }

  return {
    type: TransactionType.DEBIT,
    date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    category: "",
  } as Partial<TransactionRequest>;
};

const TransactionForm = ({
  open,
  onClose,
  profileId,
  transaction,
  onSuccess,
  onError,
}: TransactionFormProps) => {
  const isEditMode = Boolean(transaction);
  const { user } = useAuthStore();
  const { mutate: createTransaction, isPending: isCreating } = useCreateTransaction();
  const { updateTransaction, isLoading: isUpdating } = useUpdateTransaction(profileId || transaction?.profileId);
  const { data: categories = [] } = useCategories();

  const [formData, setFormData] = useState<Partial<TransactionRequest>>(getInitialFormData(transaction));
  const [error, setError] = useState<string | null>(null);
  const categoryOptions = categories.map((cat) => cat.name);

  useEffect(() => {
    setFormData(getInitialFormData(transaction));
    setError(null);
  }, [transaction, open]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.amount || formData.amount <= 0) {
      setError("Amount must be greater than 0");
      onError?.("Amount must be greater than 0");
      return;
    }
    if (!formData.category || formData.category.trim() === "") {
      setError("Category is required");
      onError?.("Category is required");
      return;
    }
    if (!formData.type) {
      setError("Type is required");
      onError?.("Type is required");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      onError?.("User not authenticated");
      return;
    }

    // Convert date to ISO string if it's in datetime-local format (YYYY-MM-DDTHH:mm)
    let dateValue = formData.date;
    if (dateValue && dateValue.includes("T") && !dateValue.includes("Z")) {
      // Convert YYYY-MM-DDTHH:mm to ISO datetime
      dateValue = new Date(`${dateValue}:00Z`).toISOString();
    } else if (!dateValue) {
      dateValue = new Date().toISOString();
    }

    const requestData: Partial<TransactionRequest> = {
      amount: Number(formData.amount),
      type: formData.type as any,
      category: formData.category.trim(),
      note: formData.note,
      date: dateValue,
    };

    if (isEditMode && transaction) {
      updateTransaction(
        { id: transaction._id, data: requestData },
        {
          onSuccess: () => {
            setError(null);
            onSuccess?.();
            onClose();
          },
          onError: (err: any) => {
            const message = err?.message || "Failed to update transaction";
            setError(message);
            onError?.(message);
          },
        }
      );
      return;
    }

    const request: TransactionRequest = {
      amount: Number(formData.amount),
      type: formData.type as any,
      userId: user.id,
      profileId,
      category: formData.category.trim(),
      note: formData.note,
      date: dateValue,
    };

    createTransaction(request, {
      onSuccess: () => {
        setFormData(getInitialFormData(undefined));
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        const message = err?.message || "Failed to create transaction";
        setError(message);
        onError?.(message);
      },
    });
  };

  const handleClose = () => {
    if (!isCreating && !isUpdating) {
      setFormData(getInitialFormData(transaction));
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, p: { xs: 1.5, sm: 2 } }}>
        {isEditMode ? "Edit Transaction" : "Add Transaction"}
      </DialogTitle>
      <DialogContent sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Amount */}
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount || ""}
            onChange={handleTextChange}
            inputProps={{ step: "0.01", min: "0" }}
            disabled={isCreating || isUpdating}
            placeholder="0.00"
          />

          {/* Type */}
          <FormControl fullWidth disabled={isCreating || isUpdating}>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type || ""}
              onChange={handleSelectChange}
              label="Type"
            >
              <MenuItem value={TransactionType.CREDIT}>Credit (Income)</MenuItem>
              <MenuItem value={TransactionType.DEBIT}>Debit (Expense)</MenuItem>
            </Select>
          </FormControl>

          {/* Category */}
          <Autocomplete
            freeSolo
            options={categoryOptions}
            value={formData.category || ""}
            onChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                category: value || "",
              }));
              setError(null);
            }}
            onInputChange={(_, value) => {
              setFormData((prev) => ({
                ...prev,
                category: value,
              }));
              setError(null);
            }}
            disabled={isCreating || isUpdating}
            renderInput={(params) => (
              <TextField {...params} label="Category" placeholder="Select or type category..." />
            )}
          />

          {/* Date and Time */}
          <TextField
            fullWidth
            label="Date & Time"
            name="date"
            type="datetime-local"
            value={formData.date || ""}
            onChange={handleTextChange}
            disabled={isCreating || isUpdating}
            InputLabelProps={{ shrink: true }}
          />

          {/* Note */}
          <TextField
            fullWidth
            label="Note"
            name="note"
            value={formData.note || ""}
            onChange={handleTextChange}
            disabled={isCreating || isUpdating}
            multiline
            rows={3}
            placeholder="Optional notes..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isCreating || isUpdating}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || isUpdating}
          startIcon={(isCreating || isUpdating) && <CircularProgress size={20} />}
        >
          {isEditMode ? (isUpdating ? "Saving..." : "Save Changes") : isCreating ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
