import api from "../api/axios";
import type {
  LoginForm,
  SignupForm,
  AuthResponse,
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
  data: SignupForm
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    "/auth/signup",
    data
  );

  return response.data;
};