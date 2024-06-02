import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/api/services/auth-service";

import { RootState } from "@/app/store";

import {
  getCurrentUser,
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyEmail,
} from "@/features/auth/thunks";

interface AuthThunkState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

interface AuthState {
  user: User | null;
  getCurrentUser: AuthThunkState;
  forgotPassword: AuthThunkState;
  resetPassword: AuthThunkState;
  signIn: AuthThunkState;
  signOut: AuthThunkState;
  signUp: AuthThunkState;
  verifyEmail: AuthThunkState;
}

interface ErrorPayload {
  errors: {
    message: string;
    field?: string;
  }[];
}

const initialThunkState: AuthThunkState = {
  loading: false,
  error: null,
  success: null,
};

const initialState: AuthState = {
  user: null,
  getCurrentUser: { ...initialThunkState, loading: true },
  forgotPassword: { ...initialThunkState },
  resetPassword: { ...initialThunkState },
  signIn: { ...initialThunkState },
  signOut: { ...initialThunkState },
  signUp: { ...initialThunkState },
  verifyEmail: { ...initialThunkState },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetGetCurrentUserState: (state: AuthState) => {
      state.getCurrentUser = initialState.getCurrentUser;
    },
    resetForgotPasswordState: (state: AuthState) => {
      state.forgotPassword = initialState.forgotPassword;
    },
    resetResetPasswordState: (state: AuthState) => {
      state.resetPassword = initialState.resetPassword;
    },
    resetSignInState: (state: AuthState) => {
      state.signIn = initialState.signIn;
    },
    resetSignOutState: (state: AuthState) => {
      state.signOut = initialState.signOut;
    },
    resetSignUpState: (state: AuthState) => {
      state.signUp = initialState.signUp;
    },
    resetVerifyEmailState: (state: AuthState) => {
      state.verifyEmail = initialState.verifyEmail;
    },
  },
  extraReducers: (builder) => {
    builder
      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword.loading = true;
        state.forgotPassword.error = state.forgotPassword.success = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.success =
          "An email with reset password instructions has been sent.";
        state.forgotPassword.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPassword.loading = false;
        state.forgotPassword.success = null;
        state.forgotPassword.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      // get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.getCurrentUser.loading = true;
        state.getCurrentUser.error = state.getCurrentUser.success = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.getCurrentUser.loading = false;
        state.user = action.payload;
        state.getCurrentUser.error = state.getCurrentUser.success = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.getCurrentUser.loading = false;
        state.getCurrentUser.success = null;
        state.getCurrentUser.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = state.resetPassword.success = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.success = "Password has been reset successfully!";
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.success = null;
        state.resetPassword.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      // sign in
      .addCase(signIn.pending, (state) => {
        state.signIn.loading = true;
        state.signIn.error = state.signIn.success = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.signIn.loading = false;
        state.user = action.payload;
        state.signIn.error = state.signIn.success = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.signIn.loading = false;
        state.signIn.success = null;
        state.signIn.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      // sign out
      .addCase(signOut.pending, (state) => {
        state.signOut.loading = true;
        state.signOut.error = state.signOut.success = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.signOut.loading = false;
        state.user = null;
        state.signOut.error = state.signOut.success = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.signOut.loading = false;
        state.signOut.success = null;
        state.signOut.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      // sign up
      .addCase(signUp.pending, (state) => {
        state.signUp.loading = true;
        state.signUp.error = state.signUp.success = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.signUp.loading = false;
        state.signUp.success =
          "A verification email has been sent. Please verify your email.";
        state.signUp.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUp.loading = false;
        state.signUp.success = null;
        state.signUp.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      })
      // verify email
      .addCase(verifyEmail.pending, (state) => {
        state.verifyEmail.loading = true;
        state.verifyEmail.error = state.verifyEmail.success = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verifyEmail.loading = false;
        state.verifyEmail.success = "Email verified successfully.";
        state.verifyEmail.error = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyEmail.loading = false;
        state.verifyEmail.success = null;
        state.verifyEmail.error = (action.payload as ErrorPayload).errors
          .map((err) => err.message)
          .join("\n");
      });
  },
});

export const forgotPasswordReducer = (state: RootState) =>
  state.auth.forgotPassword;
export const getCurrentUserReducer = (state: RootState) =>
  state.auth.getCurrentUser;
export const resetPasswordReducer = (state: RootState) =>
  state.auth.resetPassword;
export const signInReducer = (state: RootState) => state.auth.signIn;
export const signOutReducer = (state: RootState) => state.auth.signOut;
export const signUpReducer = (state: RootState) => state.auth.signUp;
export const userReducer = (state: RootState) => state.auth.user;
export const verifyEmailReducer = (state: RootState) => state.auth.verifyEmail;

export const {
  resetForgotPasswordState,
  resetGetCurrentUserState,
  resetResetPasswordState,
  resetSignInState,
  resetSignOutState,
  resetSignUpState,
  resetVerifyEmailState,
} = authSlice.actions;

export default authSlice.reducer;
