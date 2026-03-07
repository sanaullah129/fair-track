import { Chip, Stack, Typography, Box, Tooltip } from "@mui/material";
import { NoteAltOutlined, TrendingDown, TrendingUp } from "@mui/icons-material";
import { formatCurrency, formatDate, isCredit } from "./helpers/helperFunc";
import type { TransactionResponse } from "../../types/api";

const TransactionRow = ({
  tx,
  categoryMap,
}: {
  tx: TransactionResponse;
  categoryMap: Record<string, string>;
}) => {
  const isCreditTx = isCredit(tx.type);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.5,
        px: 1,
        borderRadius: 2,
        transition: "background 0.15s ease",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      {/* Icon bubble */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: isCreditTx ? "success.light" : "error.light",
          color: isCreditTx ? "success.dark" : "error.dark",
        }}
      >
        {isCreditTx ? (
          <TrendingUp fontSize="small" />
        ) : (
          <TrendingDown fontSize="small" />
        )}
      </Box>

      {/* Category + note */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {categoryMap[tx.categoryId] ?? tx.categoryId}
          </Typography>
          {tx.note && (
            <Tooltip title={tx.note} placement="top" arrow>
              <NoteAltOutlined
                sx={{ fontSize: 14, color: "text.disabled", flexShrink: 0 }}
              />
            </Tooltip>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {formatDate(tx.date)}
        </Typography>
      </Box>

      {/* Amount + badge */}
      <Stack alignItems="flex-end" gap={0.5} flexShrink={0}>
        <Typography
          variant="body2"
          fontWeight={700}
          color={isCreditTx ? "success.main" : "error.main"}
        >
          {isCreditTx ? "+" : "−"} {formatCurrency(tx.amount)}
        </Typography>
        <Chip
          label={tx.type.toUpperCase()}
          size="small"
          color={isCreditTx ? "success" : "error"}
          variant="outlined"
          sx={{ height: 18, fontSize: "0.6rem", fontWeight: 600 }}
        />
      </Stack>
    </Box>
  );
};

export default TransactionRow;
