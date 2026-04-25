import { ListItem, ListItemText, Box, IconButton, Tooltip, Switch, useMediaQuery } from "@mui/material";
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
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <ListItem
      secondaryAction={
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          <Tooltip title={profile.isActive ? "Deactivate" : "Activate"}>
            <Switch
              edge="end"
              checked={profile.isActive}
              onChange={(e) => onToggleActive(profile._id, e.target.checked)}
              disabled={isTogglingActive || isSelfProfile}
              size={isMobile ? "small" : "medium"}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              edge="end"
              onClick={() => onEdit(profile)}
              size={isMobile ? "small" : "large"}
              disabled={isTogglingActive}
              sx={{ mr: { xs: 0.5, sm: 1 } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={isSelfProfile ? "Cannot delete default profile" : "Delete"}>
            <span>
              <IconButton
                edge="end"
                onClick={() => onDelete(profile._id)}
                size={isMobile ? "small" : "large"}
                color="error"
                disabled={isSelfProfile || isTogglingActive}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      }
    >
      <ListItemText
        primary={`${profile.name}${isSelfProfile ? " (Default)" : ""}${!profile.isActive ? " (Inactive)" : ""}`}
        slotProps={{
          primary: { fontSize: { xs: '0.875rem', sm: '1rem' } }
        }}
        secondary={
          <>
            <span style={{ fontSize: "0.65rem", marginTop: "4px", color: "#999", display: "block" }}>
              Created: {new Date(profile.createdAt).toLocaleString()}
            </span>
            <span style={{ fontSize: "0.65rem", color: "#999", display: "block" }}>
              Updated: {new Date(profile.updatedAt).toLocaleString()}
            </span>
          </>
        }
      />
    </ListItem>
  );
};

export default ProfileItem;
