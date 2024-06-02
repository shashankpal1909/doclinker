import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import authService from "@/api/services/auth-service";

import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "@/lib/dtos";

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (dto: ForgotPasswordDTO, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(dto);
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

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    payload: {
      token: string;
      dto: ResetPasswordDTO;
    },
    thunkAPI,
  ) => {
    try {
      const response = await authService.resetPassword(
        payload.token,
        payload.dto,
      );
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

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, thunkAPI) => {
    try {
      const response = await authService.verifyEmail(token);
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
