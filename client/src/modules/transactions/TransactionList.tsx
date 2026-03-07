import { Box, Typography, Divider, Stack, Skeleton } from "@mui/material";
import { useTransactionsByProfile } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import SummaryBar from "./SummaryBar";
import TransactionRow from "./TransactionRow";

interface TransactionListProps {
  profileId?: string;
}

const TransactionList = ({ profileId }: TransactionListProps) => {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useTransactionsByProfile(profileId);
  const { data: categories = [] } = useCategories();

  if (isLoading) {
    return (
      <Stack spacing={1.5} mt={2}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={56} />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 6, color: "error.main" }}>
        <Typography variant="body2">Failed to load transactions.</Typography>
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
        <Typography variant="body2">No transactions found.</Typography>
      </Box>
    );
  }

  // Build category map for quick lookup
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat) => {
    categoryMap[cat._id] = cat.name;
  });

  return (
    <Box mt={2}>
      <SummaryBar transactions={transactions} />
      <Stack divider={<Divider flexItem />}>
        {transactions.map((tx) => (
          <TransactionRow key={tx._id} tx={tx} categoryMap={categoryMap} />
        ))}
      </Stack>
    </Box>
  );
};

export default TransactionList;
