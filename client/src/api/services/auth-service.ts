import apiClient from "@/api/client";

import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
} from "@/lib/dtos";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  gender: string;
  dob: string;
}

class AuthService {
  async signIn(dto: SignInDTO): Promise<User> {
    const response = await apiClient.post<User>("/users/signin", dto);
    return response.data;
  }

  async signUp(dto: SignUpDTO): Promise<void> {
    const response = await apiClient.post("/users/signup", dto);
    return response.data;
  }

  async signOut(): Promise<void> {
    const response = await apiClient.post("/users/signout");
    return response.data;
  }

  async getCurrentUser(): Promise<User | null> {
    const response = await apiClient.get<{ currentUser: User | null }>(
      "/users/currentuser",
    );
    return response.data.currentUser;
  }

  async verifyEmail(token: string): Promise<void> {
    const response = await apiClient.post(`/users/verify-email/${token}`);
    return response.data;
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const response = await apiClient.post(`/users/forgot-password`, dto);
    return response.data;
  }

  async resetPassword(token: string, dto: ResetPasswordDTO): Promise<void> {
    const response = await apiClient.post(
      `/users/reset-password/${token}`,
      dto,
    );
    return response.data;
  }
}

export default new AuthService();
