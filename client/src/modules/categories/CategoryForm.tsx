import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import type { CategoryResponse } from "../../types/api";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  isLoading?: boolean;
  editingCategory?: CategoryResponse | null;
}

const CategoryForm = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  editingCategory,
}: CategoryFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description || "");
    } else {
      setName("");
      setDescription("");
    }
    setErrors({});
  }, [editingCategory, open]);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      setErrors({ name: "Category name is required" });
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingCategory ? "Edit Category" : "Create New Category"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({});
          }}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isLoading}
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Description (Optional)"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : editingCategory ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
