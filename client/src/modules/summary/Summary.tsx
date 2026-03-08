import { Box, Typography, Card, CardContent, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Divider, Stack, List, ListItem, Chip } from "@mui/material";
import { useState, useMemo } from "react";
import { useProfilesByUser } from "../../hooks/useProfiles";
import { useTransactionsByProfile } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Shimmer from "../../components/Shimmer";

const Summary = () => {
  const { data: profiles, isLoading: profilesLoading } = useProfilesByUser();
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactionsByProfile(selectedProfileId);
  const { data: categories = [] } = useCategories();

  // Set first profile as selected on load
  const firstProfileId = useMemo(() => {
    if (profiles && profiles.length > 0 && !selectedProfileId) {
      return profiles[0]._id;
    }
    return selectedProfileId;
  }, [profiles, selectedProfileId]);

  const activeProfileId = selectedProfileId || firstProfileId;

  const handleProfileChange = (event: any) => {
    setSelectedProfileId(event.target.value);
  };

  // Category map for lookup
  const categoryMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categories]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const lastTenTransactions = transactions.slice(0, 10);
    let totalIncome = 0;
    let totalExpense = 0;
    let currentBalance = 0;

    lastTenTransactions.forEach((tx) => {
      if (tx.type === "credit") {
        totalIncome += tx.amount;
        currentBalance += tx.amount;
      } else {
        totalExpense += tx.amount;
        currentBalance -= tx.amount;
      }
    });

    return {
      transactions: lastTenTransactions,
      totalIncome,
      totalExpense,
      currentBalance,
    };
  }, [transactions]);

  const activeProfile = useMemo(() => {
    return profiles?.find((p) => p._id === activeProfileId);
  }, [profiles, activeProfileId]);

  if (profilesLoading) {
    return <Shimmer lines={8} shape="text" />;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No profiles found. Create a profile first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, mb: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1">
          Summary
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Profile</InputLabel>
          <Select
            value={activeProfileId}
            onChange={handleProfileChange}
            label="Select Profile"
          >
            {profiles.map((profile) => (
              <MenuItem key={profile._id} value={profile._id}>
                {profile.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Balance Card */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          mb: 4,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            Current Balance - {activeProfile?.name}
          </Typography>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: "bold" }}>
            {summary.currentBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }} columns={{ xs: 12, sm: 12, md: 12 }}>
        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: "#e8f5e9",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <ArrowUpwardIcon sx={{ color: "#4caf50", fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                Total Income
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ color: "#2e7d32", fontWeight: "bold" }}>
              +{summary.totalIncome.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: "#ffebee",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <ArrowDownwardIcon sx={{ color: "#f44336", fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: "#f44336", fontWeight: "bold" }}>
                Total Expense
              </Typography>
            </Stack>
            <Typography variant="h5" sx={{ color: "#c62828", fontWeight: "bold" }}>
              -{summary.totalExpense.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
              })}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Card sx={{ mb: 10 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
            Recent Transactions (Last 10)
          </Typography>

          {transactionsLoading ? (
            <Box sx={{ width: "100%" }}>
              <Shimmer lines={5} shape="rectangular" />
            </Box>
          ) : summary.transactions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
              No transactions found
            </Typography>
          ) : (
            <List sx={{ width: "100%" }}>
              {summary.transactions.map((tx, index) => (
                <Box key={tx._id}>
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 0,
                      py: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        {categoryMap[tx.category] || tx.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {tx.note && ` • ${tx.note}`}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", ml: 2 }}>
                      <Chip
                        label={tx.type === "credit" ? "Income" : "Expense"}
                        size="small"
                        color={tx.type === "credit" ? "success" : "error"}
                        variant="outlined"
                        sx={{ mb: 0.5, display: "block" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: tx.type === "credit" ? "#4caf50" : "#f44336",
                        }}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {tx.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </Typography>
                    </Box>
                  </ListItem>
                  {index < summary.transactions.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Summary;
