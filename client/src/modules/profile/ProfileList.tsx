import { Box, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import type { ProfileModel } from "../../types/api";
import ProfileItem from "./ProfileItem";

interface ProfileListProps {
  profiles?: ProfileModel[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit: (profile: ProfileModel) => void;
  onDelete: (id: string) => void;
}

const ProfileList = ({
  profiles,
  isLoading = false,
  error,
  onEdit,
  onDelete,
}: ProfileListProps) => {
  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{(error as any)?.message || "Failed to load profiles"}</Alert>;

  return (
    <Box>
      <List>
        {profiles && profiles.length > 0 ? (
          profiles.map((profile) => (
            <ProfileItem
              key={profile._id}
              profile={profile}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No profiles found" />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default ProfileList;
