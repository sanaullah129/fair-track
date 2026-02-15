import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const Login = () => {
  return (
    <Box
      component="form"
      onSubmit={() => {}}
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 8,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5">Sign in</Typography>
      <TextField
        label="Email"
        type="email"
        value={""}
        onChange={() => {}}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={""}
        onChange={() => {}}
        required
      />
      <Button
        type="submit"
        variant="contained"
        disabled={false}
        startIcon={false ? <CircularProgress size={18} /> : undefined}
      >
        {false ? "Signing in..." : "Sign in"}
      </Button>
    </Box>
  );
};

export default Login;
