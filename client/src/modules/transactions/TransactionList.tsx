import { Box, Typography, Divider, Stack, Skeleton, Pagination, Paper, useMediaQuery } from "@mui/material";
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
    pagination,
    isLoading,
    error,
    setPage,
  } = useTransactionsByProfile(profileId);
  const { data: categories = [] } = useCategories();
  const isMobile = useMediaQuery('(max-width:600px)');

  if (isLoading) {
    return (
      <Stack spacing={{ xs: 1, sm: 1.5 }} mt={{ xs: 1, sm: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={isMobile?  48: 56 } />
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: { xs: 3, sm: 6 }, color: "error.main" }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>Failed to load transactions.</Typography>
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box sx={{ textAlign: "center", py: { xs: 3, sm: 6 }, color: "text.secondary" }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>No transactions found.</Typography>
      </Box>
    );
  }

  // Build category map for quick lookup
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat) => {
    categoryMap[cat._id] = cat.name;
  });

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  }

  return (
    <Box mt={{ xs: 1, sm: 2 }}>
      <SummaryBar transactions={transactions} />
      <Stack divider={<Divider flexItem />} spacing={0}>
        {transactions.map((tx) => (
          <TransactionRow key={tx._id} tx={tx} categoryMap={categoryMap} />
        ))}
      </Stack>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
            mt: { xs: 1.5, sm: 2 },
            backgroundColor: "background.paper",
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            Page {pagination.page} of {pagination.pages} | Total: {pagination.total}
          </Typography>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            size="small"
          />
        </Paper>
      )}
    </Box>
  );
};

export default TransactionList;
