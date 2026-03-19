import { Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface StatsGridProps {
  totalIncome: number;
  totalExpense: number;
}

const StatsGrid = ({ totalIncome, totalExpense }: StatsGridProps) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{ mb: 4 }}
      columns={{ xs: 12, sm: 12, md: 12 }}
    >
      <Grid columnSpacing={{ xs: 12, sm: 6 }}>
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
            <Typography
              variant="body2"
              sx={{ color: "#4caf50", fontWeight: "bold" }}
            >
              Total Income
            </Typography>
          </Stack>
          <Typography
            variant="h5"
            sx={{ color: "#2e7d32", fontWeight: "bold" }}
          >
            +
            {totalIncome.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </Typography>
        </Paper>
      </Grid>

      <Grid columnSpacing={{ xs: 12, sm: 6 }}>
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
            <Typography
              variant="body2"
              sx={{ color: "#f44336", fontWeight: "bold" }}
            >
              Total Expense
            </Typography>
          </Stack>
          <Typography
            variant="h5"
            sx={{ color: "#c62828", fontWeight: "bold" }}
          >
            -
            {totalExpense.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default StatsGrid;
