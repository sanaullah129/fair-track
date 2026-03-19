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
    <Card sx={{ mb: 10 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
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
          <List sx={{ width: "100%" }}>
            {transactions.map((tx, index) => (
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
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
