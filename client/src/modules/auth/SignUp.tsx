import React, { useReducer } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";
import { signUpReducer } from "./helpers";
import type { IAuthData } from "./IAuth";
import { useSignUp } from "../../hooks/useSignUp";

const SignUp = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isPending, error } = useSignUp();
  
  const initialState: IAuthData = {
    username: "",
    email: "",
    password: "",
  };
  const [state, dispatch] = useReducer(signUpReducer, initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name as keyof IAuthData, payload: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUp(state, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
      {error && (
        <Alert severity="error">
          {error instanceof Error ? error.message : "An error occurred"}
        </Alert>
      )}
      <TextField
        label="Full name"
        name="username"
        value={state.username}
        onChange={handleChange}
        required
        disabled={isPending}
      />
      <TextField
        label="Email"
        type="email"
        name="email"
        value={state.email}
        onChange={handleChange}
        required
        disabled={isPending}
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        value={state.password}
        onChange={handleChange}
        required
        disabled={isPending}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={isPending}
        startIcon={isPending ? <CircularProgress size={18} /> : undefined}
      >
        {isPending ? "Creating account..." : "Create account"}
      </Button>
      <Button
        variant="text"
        onClick={() => navigate('/login')}
        disabled={isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        Already have an account? Sign in
      </Button>
    </Box>
  );
};

export default SignUp;
