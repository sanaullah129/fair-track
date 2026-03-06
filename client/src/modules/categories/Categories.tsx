
import { useState } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../hooks/useCategories";
import type { CategoryResponse } from "../../types/api";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";

const Categories = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Queries and Mutations
  const { data: categories, isLoading, error } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleOpenForm = () => {
    setEditingCategory(null);
    setOpenForm(true);
  };

  const handleEditCategory = (category: CategoryResponse) => {
    setEditingCategory(category);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCategory(null);
  };

  const handleSubmitForm = async (data: { name: string; description?: string }) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory._id,
          data,
        });
        setSnackbar({
          open: true,
          message: "Category updated successfully!",
          severity: "success",
        });
      } else {
        await createCategoryMutation.mutateAsync(data);
        setSnackbar({
          open: true,
          message: "Category created successfully!",
          severity: "success",
        });
      }
      handleCloseForm();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.message || "An error occurred",
        severity: "error",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
        setSnackbar({
          open: true,
          message: "Category deleted successfully!",
          severity: "success",
        });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err?.message || "Failed to delete category",
          severity: "error",
        });
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" component="h1">
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          New Category
        </Button>
      </Box>

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        error={error}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      <CategoryForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editingCategory={editingCategory}
        isLoading={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Categories;
