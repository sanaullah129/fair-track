import { Box, Typography, Tabs, Tab, Snackbar, Alert, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useProfilesByUser } from "../../hooks/useProfiles";
import Shimmer from "../../components/Shimmer";
import TransactionList from "./TransactionList";
import TransactionForm from "./TransactionForm";

const Transactions = () => {
  const { data: profiles, error, isLoading } = useProfilesByUser();
  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: "Failed to load profiles",
        severity: "error",
      });
    }
  }, [error]);

  if (isLoading) {
    return <Shimmer lines={5} shape="text" />;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No profiles found.
        </Typography>
      </Box>
    );
  }

  const handleChange = (event: React.SyntheticEvent, newTabValue: number) => {
    event.preventDefault();
    setTabValue(newTabValue);
  };

  const currentProfile = profiles[tabValue];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" component="h1">
          Transactions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          disabled={!currentProfile}
        >
          Add Transaction
        </Button>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="profile tabs"
        >
          {profiles.map((profile) => (
            <Tab key={profile._id} label={profile.name} />
          ))}
        </Tabs>
      </Box>

      {currentProfile && <TransactionList profileId={currentProfile._id} />}

      {currentProfile && (
        <TransactionForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          profileId={currentProfile._id}
          onSuccess={() => {
            setSnackbar({
              open: true,
              message: "Transaction created successfully!",
              severity: "success",
            });
          }}
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

export default Transactions;
