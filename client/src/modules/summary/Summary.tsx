import { Box, Typography } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useProfilesByUser } from "../../hooks/useProfiles";
import { useTransactionsByProfile } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { useSummaryByProfile } from "../../hooks/useSummary";
import Shimmer from "../../components/Shimmer";
import SummaryHeader from "./SummaryHeader";
import CurrentBalanceCard from "./CurrentBalanceCard";
import StatsGrid from "./StatsGrid";
import RecentTransactionsList from "./RecentTransactionsList";

const Summary = () => {
  const { profileId: urlProfileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { data: profiles, isLoading: profilesLoading } =
    useProfilesByUser(true);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const { data: categories = [] } = useCategories();

  // Set profile from URL or first available profile
  const activeProfileId = useMemo(() => {
    // First priority: URL parameter
    if (urlProfileId) {
      return urlProfileId;
    }
    // Second priority: selected profile from dropdown
    if (selectedProfileId) {
      return selectedProfileId;
    }
    // Third priority: first available profile
    if (profiles && profiles.length > 0) {
      return profiles[0]._id;
    }
    return "";
  }, [urlProfileId, selectedProfileId, profiles]);

  // Update selectedProfileId when URL changes
  React.useEffect(() => {
    if (urlProfileId && urlProfileId !== selectedProfileId) {
      setSelectedProfileId(urlProfileId);
    }
  }, [urlProfileId, selectedProfileId]);

  // Fetch data using activeProfileId
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } =
    useTransactionsByProfile(activeProfileId);
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useSummaryByProfile(activeProfileId);

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
    // Update URL to reflect the selected profile
    navigate(`/overall-summary/${profileId}`, { replace: true });
  };

  // Category map for lookup
  const categoryMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat._id] = cat.name;
    });
    return map;
  }, [categories]);

  const activeProfile = useMemo(() => {
    return profiles?.find((p) => p._id === activeProfileId);
  }, [profiles, activeProfileId]);

  // Get recent transactions limited to 10 for display
  const recentTransactions = transactions.slice(0, 10);

  if (profilesLoading || (activeProfileId && summaryLoading)) {
    return <Shimmer lines={8} shape="text" />;
  }

  if (!profiles || profiles.length === 0) {
    return (
      <Box sx={{ maxWidth: { xs: "95%", sm: 1000 }, mx: "auto", mt: { xs: 2, sm: 4 }, mb: { xs: 12, sm: 4 }, px: { xs: 1, sm: 0 } }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
          Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No profiles found. Create a profile first.
        </Typography>
      </Box>
    );
  }

  // Show errors if any
  if (summaryError || transactionsError) {
    return (
      <Box sx={{ maxWidth: { xs: "95%", sm: 1000 }, mx: "auto", mt: { xs: 2, sm: 4 }, mb: { xs: 12, sm: 4 }, px: { xs: 1, sm: 0 } }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
          Summary
        </Typography>
        <Typography variant="body2" color="error">
          Error loading data: {summaryError?.message || transactionsError?.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: { xs: "95%", sm: 1000 }, mx: "auto", mt: { xs: 2, sm: 4 }, mb: { xs: 12, sm: 4 }, px: { xs: 1, sm: 0 } }}>
      <SummaryHeader
        profiles={profiles}
        activeProfileId={activeProfileId}
        onProfileChange={handleProfileChange}
      />

      <CurrentBalanceCard
        balance={summaryData?.currentBalance ?? 0}
        profile={activeProfile}
      />

      <StatsGrid
        totalIncome={summaryData?.totalIncome ?? 0}
        totalExpense={summaryData?.totalExpense ?? 0}
      />

      <RecentTransactionsList
        transactions={recentTransactions}
        categoryMap={categoryMap}
        isLoading={transactionsLoading}
      />
    </Box>
  );
};

export default Summary;
