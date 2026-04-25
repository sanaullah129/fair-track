import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState } from "react";
import type { ProfileModel } from "../../types/api";

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  isLoading?: boolean;
  editingProfile?: ProfileModel | null;
}

const ProfileFormContent = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  editingProfile,
}: ProfileFormProps) => {
  const [name, setName] = useState(editingProfile?.name ?? "");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      setErrors({ name: "Profile name is required" });
      return;
    }

    if (name.trim().length < 2) {
      setErrors({ name: "Profile name must be at least 2 characters" });
      return;
    }

    onSubmit({
      name: name.trim(),
    });
  };

  const handleClose = () => {
    setName("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingProfile ? "Edit Profile" : "Create New Profile"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Profile Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({});
          }}
          error={!!errors.name}
          helperText={errors.name}
          disabled={isLoading || (editingProfile?.name === "Self")}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : editingProfile ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProfileForm = (props: ProfileFormProps) => {
  const { open, editingProfile } = props;
  const key = `${open}-${editingProfile?._id ?? "new"}`;

  return <ProfileFormContent key={key} {...props} />;
};

export default ProfileForm;
