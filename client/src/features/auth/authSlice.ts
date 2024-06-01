import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import authService from "@/api/services/auth-service";

import { SignInDTO, SignUpDTO } from "@/lib/dtos";

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    gender: string;
    dob: string;
  } | null;
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
  loading: true,
  error: null,
  success: null,
};

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (dto: SignInDTO, thunkAPI) => {
    try {
      const response = await authService.signIn(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (dto: SignUpDTO, thunkAPI) => {
    try {
      const response = await authService.signUp(dto);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error?.response?.data);
      } else {
        throw error;
      }
    }
  },
);

export const signOut = createAsyncThunk("auth/signOut", async (_, thunkAPI) => {
  try {
    const response = await authService.signOut();
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    } else {
      throw error;
    }
  }
});

// Similar thunks for other actions (verifyEmail, forgotPassword, resetPassword, changePassword, logout)...

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = state.success = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = state.success = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
        state.success =
          "Verification email has been sent! Please verify your email.";
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = state.success = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = state.success = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
