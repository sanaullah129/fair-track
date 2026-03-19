import { ListItem, ListItemText, Box, IconButton, Tooltip, Switch } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { ProfileModel } from "../../types/api";

interface ProfileItemProps {
  profile: ProfileModel;
  onEdit: (profile: ProfileModel) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isTogglingActive?: boolean;
}

const ProfileItem = ({ profile, onEdit, onDelete, onToggleActive, isTogglingActive = false }: ProfileItemProps) => {
  const isSelfProfile = profile.name === "Self";

  return (
    <ListItem
      secondaryAction={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={profile.isActive ? "Deactivate" : "Activate"}>
            <Switch
              edge="end"
              checked={profile.isActive}
              onChange={(e) => onToggleActive(profile._id, e.target.checked)}
              disabled={isTogglingActive || isSelfProfile}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              edge="end"
              onClick={() => onEdit(profile)}
              size="small"
              disabled={isTogglingActive}
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
                disabled={isSelfProfile || isTogglingActive}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={`${profile.name}${isSelfProfile ? " (Default)" : ""}${!profile.isActive ? " (Inactive)" : ""}`}
        secondary={
          <>
            <span style={{ fontSize: "0.75rem", marginTop: "4px", color: "#999", display: "block" }}>
              Created: {new Date(profile.createdAt).toLocaleString()}
            </span>
            <span style={{ fontSize: "0.75rem", color: "#999", display: "block" }}>
              Updated: {new Date(profile.updatedAt).toLocaleString()}
            </span>
          </>
        }
      />
    </ListItem>
  );
};

export default ProfileItem;
