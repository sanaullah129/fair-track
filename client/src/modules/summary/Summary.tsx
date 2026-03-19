import { Box, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { useProfilesByUser } from "../../hooks/useProfiles";
import { useTransactionsByProfile } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import Shimmer from "../../components/Shimmer";
import SummaryHeader from "./SummaryHeader";
import CurrentBalanceCard from "./CurrentBalanceCard";
import StatsGrid from "./StatsGrid";
import RecentTransactionsList from "./RecentTransactionsList";

const Summary = () => {
  const { data: profiles, isLoading: profilesLoading } =
    useProfilesByUser(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const { data: transactions = [], isLoading: transactionsLoading } =
    useTransactionsByProfile(selectedProfileId);
  const { data: categories = [] } = useCategories();

  // Set first profile as selected on load
  const firstProfileId = useMemo(() => {
    if (profiles && profiles.length > 0 && !selectedProfileId) {
      return profiles[0]._id;
    }
    return selectedProfileId;
  }, [profiles, selectedProfileId]);

  const activeProfileId = selectedProfileId || firstProfileId;

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
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
      <SummaryHeader
        profiles={profiles}
        activeProfileId={activeProfileId}
        onProfileChange={handleProfileChange}
      />

      <CurrentBalanceCard
        balance={summary.currentBalance}
        profile={activeProfile}
      />

      <StatsGrid
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
      />

      <RecentTransactionsList
        transactions={summary.transactions}
        categoryMap={categoryMap}
        isLoading={transactionsLoading}
      />
    </Box>
  );
};

export default Summary;
