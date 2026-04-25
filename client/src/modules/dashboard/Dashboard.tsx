import { Box, Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ maxWidth: { xs: "95%", sm: 800 }, mx: "auto", mt: { xs: 2, sm: 4 }, mb: { xs: 12, sm: 4 }, px: { xs: 1, sm: 0 } }}>
      <Typography variant="h5" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
        Dashboard feature is coming soon!
      </Typography>
    </Box>
  );
};

export default Dashboard;
