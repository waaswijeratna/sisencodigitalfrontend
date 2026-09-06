import api from "../api/axios";
import type {
  AuthResponse,
  LoginForm,
  SignupForm,
  User,
} from "../types/auth";

export const login = async (
  data: LoginForm
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
};

export const signup = async (
  data: SignupForm,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/register",
    data
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ user: User }>("/auth/me");
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};