import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import authService from "@/api/services/auth-service";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    gender: string;
    dob: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface ErrorPayload {
  errors: {
    message: string;
    field?: string;
  }[];
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await authService.signIn(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    data: {
      name: string;
      email: string;
      password: string;
      role: string;
      gender: string;
      dob: string;
    },
    thunkAPI,
  ) => {
    try {
      const response = await authService.signUp(data);
      return response;
    } catch (error) {
      console.log("error type", typeof error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Similar thunks for other actions (verifyEmail, forgotPassword, resetPassword, changePassword, logout)...

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, newLocal)
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
        state.success =
          "Verification email has been sent! Please verify your email.";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
