import { useState } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  useProfilesByUser,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
} from "../../hooks/useProfiles";
import type { ProfileModel } from "../../types/api";
import useAuthStore from "../../stores/useAuthStore";
import ProfileList from "./ProfileList";
import ProfileForm from "./ProfileForm";
import Shimmer from "../../components/Shimmer";

const Profiles = () => {
  const { user } = useAuthStore();
  const [openForm, setOpenForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileModel | null>(
    null,
  );
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Queries and Mutations
  const { data: profiles, isLoading, error } = useProfilesByUser();
  const createProfileMutation = useCreateProfile();
  const updateProfileMutation = useUpdateProfile();
  const deleteProfileMutation = useDeleteProfile();

  if (isLoading) {
    return <Shimmer lines={5} shape="text" />;
  }
  const handleOpenForm = () => {
    setEditingProfile(null);
    setOpenForm(true);
  };

  const handleEditProfile = (profile: ProfileModel) => {
    setEditingProfile(profile);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingProfile(null);
  };

  const handleSubmitForm = async (data: { name: string }) => {
    try {
      if (editingProfile) {
        await updateProfileMutation.mutateAsync({
          id: editingProfile._id,
          data,
        });
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
      } else {
        await createProfileMutation.mutateAsync({
          ...data,
          userId: user!.id,
        });
        setSnackbar({
          open: true,
          message: "Profile created successfully!",
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

  const handleDeleteProfile = (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDeleteProfile = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteProfileMutation.mutateAsync(confirmDeleteId);
      setSnackbar({
        open: true,
        message: "Profile deleted successfully!",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.message || "Failed to delete profile",
        severity: "error",
      });
    }
    setConfirmDeleteId(null);
  };

  const cancelDeleteProfile = () => {
    setConfirmDeleteId(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="h1">
          Profiles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          New Profile
        </Button>
      </Box>

      <ProfileList
        profiles={profiles}
        isLoading={isLoading}
        error={error}
        onEdit={handleEditProfile}
        onDelete={handleDeleteProfile}
      />

      <ProfileForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editingProfile={editingProfile}
        isLoading={
          createProfileMutation.isPending || updateProfileMutation.isPending
        }
      />

      {confirmDeleteId && (
        <ConfirmDialog
          open={!!confirmDeleteId}
          title="Delete Profile"
          content="Are you sure you want to delete this profile? All transactions will be moved to your default profile."
          onConfirm={confirmDeleteProfile}
          onCancel={cancelDeleteProfile}
        />
      )}

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

export default Profiles;
