import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router";

const SignUp = () => {
  return (
    <Box
      component="form"
      onSubmit={() => {}}
      sx={{
        maxWidth: 520,
        mx: "auto",
        mt: 8,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5">Create account</Typography>
      <TextField label="Full name" value={""} onChange={() => {}} required />
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
        {false ? "Creating account..." : "Create account"}
      </Button>
    </Box>
  );
};

export default SignUp;
