import {
  Box,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useProfilesByUser } from "../../hooks/useProfiles";
import Shimmer from "../../components/Shimmer";
import TransactionList from "./TransactionList";
import TransactionForm from "./TransactionForm";
import { useNavigate } from "react-router";

const Transactions = () => {
  const { data: profiles, error, isLoading } = useProfilesByUser();
  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

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

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTransactionSuccess = () => {
    setSnackbar({
      open: true,
      message: "Transaction created successfully!",
      severity: "success",
    });
  };

  const handleOverallSummaryClick = () => {
    const currentProfile = profiles[tabValue];
    if (currentProfile) {
      navigate(`/overall-summary/${currentProfile._id}`);
    }
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleOverallSummaryClick}
            disabled={!currentProfile}
          >
            Check Overall Summary
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
            disabled={!currentProfile}
          >
            Add Transaction
          </Button>
        </Box>
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
          onClose={handleCloseForm}
          profileId={currentProfile._id}
          onSuccess={handleTransactionSuccess}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Transactions;
