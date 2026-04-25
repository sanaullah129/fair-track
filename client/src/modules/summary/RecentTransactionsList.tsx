import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import Shimmer from "../../components/Shimmer";
import type { TransactionResponse } from "../../types/api";

interface RecentTransactionsListProps {
  transactions: TransactionResponse[];
  categoryMap: Record<string, string>;
  isLoading?: boolean;
}

const RecentTransactionsList = ({
  transactions,
  categoryMap,
  isLoading = false,
}: RecentTransactionsListProps) => {
  return (
    <Card sx={{ mb: { xs: 12, sm: 10 } }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: { xs: 2, sm: 3 }, fontWeight: "bold", fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Recent Transactions (Last 10)
        </Typography>

        {isLoading ? (
          <Box sx={{ width: "100%" }}>
            <Shimmer lines={5} shape="rectangular" />
          </Box>
        ) : transactions.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 3 }}
          >
            No transactions found
          </Typography>
        ) : (
          <List sx={{ width: "100%", p: 0 }}>
            {transactions.map((tx, index) => (
              <Box key={tx._id}>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: { xs: 0.5, sm: 0 },
                    py: { xs: 1.5, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignContent: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 1, sm: 0 }
                  }}
                >
                  <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 0.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      {categoryMap[tx.category] || tx.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {tx.note && ` • ${tx.note}`}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right", ml: { xs: 0, sm: 2 }, width: { xs: '100%', sm: 'auto' }, display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-end' }, gap: 1 }}>
                    <Chip
                      label={tx.type === "credit" ? "Income" : "Expense"}
                      size="small"
                      color={tx.type === "credit" ? "success" : "error"}
                      variant="outlined"
                      sx={{ height: { xs: 20, sm: 24 }, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "bold",
                        color: tx.type === "credit" ? "#4caf50" : "#f44336",
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        whiteSpace: 'nowrap'
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
                {index < transactions.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsList;
