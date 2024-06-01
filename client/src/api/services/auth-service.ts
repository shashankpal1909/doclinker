import apiClient from "@/api/client";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  gender: string;
  dob: string;
}

interface SignInDTO {
  email: string;
  password: string;
}

interface SignUpDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  dob: string;
}

interface ForgotPasswordDTO {
  email: string;
}

interface ResetPasswordDTO {
  password: string;
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
