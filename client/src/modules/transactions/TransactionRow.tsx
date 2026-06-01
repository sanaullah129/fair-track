import { Chip, Stack, Typography, Box, Tooltip, useMediaQuery, IconButton } from "@mui/material";
import { NoteAltOutlined, TrendingDown, TrendingUp, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { formatCurrency, formatDate, isCredit } from "./helpers/helperFunc";
import type { TransactionResponse } from "../../types/api";

const TransactionRow = ({
  tx,
  categoryMap,
  onDelete,
  onEdit,
  isDeleting = false,
}: {
  tx: TransactionResponse;
  categoryMap: Record<string, string>;
  onDelete?: () => void;
  onEdit: (transaction: TransactionResponse) => void;
  isDeleting?: boolean;
}) => {
  const isCreditTx = isCredit(tx.type);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "center", sm: "center" },
        justifyContent: { xs: "center", sm: "flex-start" },
        gap: { xs: 1.5, sm: 2 },
        py: { xs: 1, sm: 1.5 },
        px: { xs: 0.5, sm: 1 },
        borderRadius: 2,
        transition: "background 0.15s ease",
        "&:hover": { bgcolor: "action.hover" },
        "&:hover .delete-button, &:hover .edit-button": { opacity: 1 },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      {/* Icon bubble */}
      <Box
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
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
          <TrendingUp fontSize={isMobile ? "small" : "small"} />
        ) : (
          <TrendingDown fontSize={isMobile ? "small" : "small"} />
        )}
      </Box>

      {/* Category + note */}
      <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
        <Stack direction="row" alignItems="center" gap={0.75} sx={{ flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
          <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {categoryMap[tx.category] ?? tx.category}
          </Typography>
          {tx.note && (
            <Tooltip title={tx.note} placement="top" arrow>
              <NoteAltOutlined
                sx={{ fontSize: { xs: 12, sm: 14 }, color: "text.disabled", flexShrink: 0 }}
              />
            </Tooltip>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
          {formatDate(tx.date)}
        </Typography>
      </Box>

      {/* Amount + badge */}
      <Stack alignItems={{ xs: 'center', sm: 'flex-end' }} gap={0.5} flexShrink={0}>
        <Typography
          variant="body2"
          fontWeight={700}
          color={isCreditTx ? "success.main" : "error.main"}
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          {isCreditTx ? "+" : "−"} {formatCurrency(tx.amount)}
        </Typography>
        <Chip
          label={tx.type.toUpperCase()}
          size="small"
          color={isCreditTx ? "success" : "error"}
          variant="outlined"
          sx={{ height: { xs: 16, sm: 18 }, fontSize: { xs: '0.55rem', sm: '0.6rem' }, fontWeight: 600 }}
        />
      </Stack>

      <IconButton
        aria-label="Edit transaction"
        onClick={() => onEdit(tx)}
        disabled={isDeleting}
        className="edit-button"
        sx={{
          opacity: 0.35,
          color: "text.primary",
          transition: "opacity 0.2s ease",
          ml: { xs: 0, sm: 1 },
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <EditOutlined fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="Delete transaction"
        onClick={onDelete}
        disabled={isDeleting}
        className="delete-button"
        sx={{
          opacity: 0.35,
          color: "error.main",
          transition: "opacity 0.2s ease",
          ml: { xs: 0, sm: 1 },
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <DeleteOutline fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default TransactionRow;
