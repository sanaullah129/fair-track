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
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { useCreateTransaction } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import useAuthStore from "../../stores/useAuthStore";
import type { TransactionRequest } from "../../types/api";
import { TransactionType } from "../../types/api";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
  onSuccess?: () => void;
}

const TransactionForm = ({
  open,
  onClose,
  profileId,
  onSuccess,
}: TransactionFormProps) => {
  const { user } = useAuthStore();
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { data: categories = [] } = useCategories();

  const [formData, setFormData] = useState<Partial<TransactionRequest>>({
    type: TransactionType.DEBIT,
    date: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
    category: "",
  });

  const [error, setError] = useState<string | null>(null);
  const categoryOptions = categories.map((cat) => cat.name);

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
      return;
    }
    if (!formData.category || formData.category.trim() === "") {
      setError("Category is required");
      return;
    }
    if (!formData.type) {
      setError("Type is required");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
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

    // Prepare request data
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
        setFormData({ type: TransactionType.DEBIT, date: new Date().toISOString().slice(0, 16), category: "" });
        onSuccess?.();
        onClose();
      },
      onError: (err: any) => {
        setError(err.message || "Failed to create transaction");
      },
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setFormData({ type: TransactionType.DEBIT, date: new Date().toISOString().slice(0, 16), category: "" });
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Transaction</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
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
            disabled={isPending}
            placeholder="0.00"
          />

          {/* Type */}
          <FormControl fullWidth disabled={isPending}>
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
            disabled={isPending}
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
            disabled={isPending}
            InputLabelProps={{ shrink: true }}
          />

          {/* Note */}
          <TextField
            fullWidth
            label="Note"
            name="note"
            value={formData.note || ""}
            onChange={handleTextChange}
            disabled={isPending}
            multiline
            rows={3}
            placeholder="Optional notes..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isPending}
          startIcon={isPending && <CircularProgress size={20} />}
        >
          {isPending ? "Creating..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
