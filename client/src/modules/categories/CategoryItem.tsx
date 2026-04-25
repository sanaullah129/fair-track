import { ListItem, ListItemText, Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { CategoryResponse } from "../../types/api";

interface CategoryItemProps {
  category: CategoryResponse;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (id: string) => void;
}
const CategoryItem = ({ category, onEdit, onDelete }: CategoryItemProps) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <ListItem
      secondaryAction={
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
          <Tooltip title="Edit">
            <IconButton
              edge="end"
              onClick={() => onEdit(category)}
              size={isMobile ? "small" : "large"}
              sx={{ mr: { xs: 0.5, sm: 1 } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              edge="end"
              onClick={() => onDelete(category._id)}
              size={isMobile ? "small" : "large"}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={category.name}
        primaryTypographyProps={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        secondary={
          <>
            {category.description && <div style={{ fontSize: "0.8rem" }}>{category.description}</div>}
            <div style={{ fontSize: "0.65rem", marginTop: "4px", color: "#999" }}>
              Created: {new Date(category.createdAt).toLocaleString()}
            </div>
          </>
        }
      />
    </ListItem>
  );
};

export default CategoryItem;
