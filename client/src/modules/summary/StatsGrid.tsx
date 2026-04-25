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
      spacing={{ xs: 1.5, sm: 2 }}
      sx={{ mb: { xs: 2, sm: 4 } }}
      columns={{ xs: 12, sm: 12, md: 12 }}
    >
      <Grid size={{xs: 12, sm: 6}}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#e8f5e9",
            height: "100%"
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <ArrowUpwardIcon sx={{ color: "#4caf50", fontSize: { xs: 20, sm: 28 } }} />
            <Typography
              variant="body2"
              sx={{ color: "#4caf50", fontWeight: "bold", fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Total Income
            </Typography>
          </Stack>
          <Typography
            variant="h5"
            sx={{ 
              color: "#2e7d32", 
              fontWeight: "bold",
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            +
            {totalIncome.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{xs: 12, sm: 6}}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "#ffebee",
            height: "100%"
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <ArrowDownwardIcon sx={{ color: "#f44336", fontSize: { xs: 20, sm: 28 } }} />
            <Typography
              variant="body2"
              sx={{ color: "#f44336", fontWeight: "bold", fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Total Expense
            </Typography>
          </Stack>
          <Typography
            variant="h5"
            sx={{ 
              color: "#c62828", 
              fontWeight: "bold",
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
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
