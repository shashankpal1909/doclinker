import apiClient from "../client";

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  // Add other fields as necessary
}

interface SignUpDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  dob: string;
}

class AuthService {
  async signIn(credentials: Credentials): Promise<User> {
    try {
      const response = await apiClient.post<User>("/users/signin", credentials, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async signUp(userData: SignUpDTO): Promise<User> {
    try {
      const response = await apiClient.post<User>("/users/signup", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Add more auth-related API methods here
}

export default new AuthService();
