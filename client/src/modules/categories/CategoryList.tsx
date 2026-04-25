import { List, Box, CircularProgress, Alert } from "@mui/material";
import type { CategoryResponse } from "../../types/api";
import CategoryItem from "./CategoryItem";

interface CategoryListProps {
  categories: CategoryResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (id: string) => void;
}

const CategoryList = ({
  categories,
  isLoading,
  error,
  onEdit,
  onDelete,
}: CategoryListProps) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {(error as any)?.message || "Failed to load categories"}
      </Alert>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Alert severity="info">
        No categories found. Create one to get started!
      </Alert>
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper", p: { xs: 0.5, sm: 0 } }}>
      {categories.map((category) => (
        <CategoryItem
          key={category._id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};

export default CategoryList;
