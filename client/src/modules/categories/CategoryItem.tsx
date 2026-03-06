import { ListItem, ListItemText, Box, IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { CategoryResponse } from "../../types/api";

interface CategoryItemProps {
  category: CategoryResponse;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (id: string) => void;
}

const CategoryItem = ({ category, onEdit, onDelete }: CategoryItemProps) => {
  return (
    <ListItem
      secondaryAction={
        <Box>
          <Tooltip title="Edit">
            <IconButton
              edge="end"
              onClick={() => onEdit(category)}
              size="small"
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              edge="end"
              onClick={() => onDelete(category._id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={category.name}
        secondary={
          <>
            {category.description && <div>{category.description}</div>}
            <div style={{ fontSize: "0.75rem", marginTop: "4px", color: "#999" }}>
              Created: {new Date(category.createdAt).toLocaleString()}
            </div>
          </>
        }
      />
    </ListItem>
  );
};

export default CategoryItem;
