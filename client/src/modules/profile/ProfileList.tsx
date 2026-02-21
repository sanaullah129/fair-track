import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import { useProfilesByUser } from "../../hooks/useProfiles";

const ProfileList = () => {
  const { data, isLoading, error } = useProfilesByUser();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{(error as any)?.message || "Failed to load profiles"}</Alert>;

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Profiles
      </Typography>
      <List>
        {data && data.length > 0 ? (
          data.map((p) => (
            <ListItem key={p.id} divider>
              <ListItemText primary={p.name} secondary={`Created: ${new Date(p.createdAt).toLocaleString()}`} />
            </ListItem>
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
