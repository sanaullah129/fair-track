import { Box, Typography } from "@mui/material";
import type { TransactionResponse } from "../../types/api";
import { formatCurrency, isCredit } from "./helpers/helperFunc";

const SummaryBar = ({
  transactions,
}: {
  transactions: TransactionResponse[];
}) => {
  const credit = transactions
    .filter((t) => isCredit(t.type))
    .reduce((s, t) => s + t.amount, 0);
  const debit = transactions
    .filter((t) => !isCredit(t.type))
    .reduce((s, t) => s + t.amount, 0);
  const net = credit - debit;

  return (
    <Box
      sx={{
        display: "flex",
        gap: { xs: 1, sm: 2 },
        mb: 2,
        p: { xs: 1.5, sm: 2 },
        borderRadius: { xs: 1, sm: 2 },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        flexDirection: { xs: 'column', sm: 'row' }
      }}
    >
      {[
        { label: "Credits", value: credit, color: "success.main" },
        { label: "Debits", value: debit, color: "error.main" },
        {
          label: "Net",
          value: net,
          color: net >= 0 ? "success.main" : "error.main",
        },
      ].map((item, i) => (
        <Box key={i} sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {item.label}
          </Typography>
          <Typography variant="body2" fontWeight={700} color={item.color} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {formatCurrency(Math.abs(item.value))}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SummaryBar;
