import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useLogin";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ 
      maxWidth: { xs: "95%", sm: 520 }, 
      mx: "auto", 
      mt: { xs: 4, sm: 8 }, 
      mb: { xs: 12, sm: 4 },
      display: "flex", 
      flexDirection: "column", 
      gap: 2,
      px: { xs: 2, sm: 0 }
    }}>
      <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>Sign in</Typography>
      {error && <Alert severity="error">{error instanceof Error ? error.message : "An error occurred"}</Alert>}
      <TextField label="Username or Email" name="usernameOrEmail" value={form.usernameOrEmail} onChange={handleChange} required disabled={isPending} />
      <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required disabled={isPending} />
      <Button type="submit" variant="contained" disabled={isPending} startIcon={isPending ? <CircularProgress size={18} /> : undefined}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      
      <Button
        variant="text"
        onClick={() => navigate('/signup')}
        disabled={isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        Don't have an account? Create one
      </Button>
    </Box>
  );
};

export default Login;

