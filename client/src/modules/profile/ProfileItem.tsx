import { ListItem, ListItemText, Box, IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { ProfileModel } from "../../types/api";

interface ProfileItemProps {
  profile: ProfileModel;
  onEdit: (profile: ProfileModel) => void;
  onDelete: (id: string) => void;
}

const ProfileItem = ({ profile, onEdit, onDelete }: ProfileItemProps) => {
  const isSelfProfile = profile.name === "Self";

  return (
    <ListItem
      secondaryAction={
        <Box>
          <Tooltip title="Edit">
            <IconButton
              edge="end"
              onClick={() => onEdit(profile)}
              size="small"
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isSelfProfile ? "Cannot delete default profile" : "Delete"}>
            <span>
              <IconButton
                edge="end"
                onClick={() => onDelete(profile._id)}
                size="small"
                color="error"
                disabled={isSelfProfile}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={`${profile.name}${isSelfProfile ? " (Default)" : ""}`}
        secondary={
          <>
            <div style={{ fontSize: "0.75rem", marginTop: "4px", color: "#999" }}>
              Created: {new Date(profile.createdAt).toLocaleString()}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#999" }}>
              Updated: {new Date(profile.updatedAt).toLocaleString()}
            </div>
          </>
        }
      />
    </ListItem>
  );
};

export default ProfileItem;
