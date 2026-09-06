import { create } from "zustand";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";
import type { LoginForm, User } from "../types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (data: LoginForm) => Promise<User>;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (data) => {
    set({ isLoading: true });

    try {
      const response = await loginRequest(data);
      set({ user: response.user });
      return response.user;
    } finally {
      set({ isLoading: false });
    }
  },

  hydrate: async () => {
    try {
      const user = await getCurrentUser();
      set({ user });
    } catch {
      set({ user: null });
    } finally {
      set({ isInitialized: true });
    }
  },

  logout: async () => {
    try {
      await logoutRequest();
    } finally {
      set({ user: null });
    }
  },
}));