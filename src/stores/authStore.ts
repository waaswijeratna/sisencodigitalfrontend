import { create } from "zustand";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";
import type { LoginForm, User } from "../types/auth";
import { getCurrentReportId } from "../services/reportService";

interface AuthState {
  user: User | null;
  currentReportId: number | null;
  isCurrentReportLoading: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (data: LoginForm) => Promise<User>;
  hydrate: () => Promise<void>;
  fetchCurrentReportId: () => Promise<number | null>;
  setCurrentReportId: (reportId: number | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentReportId: null,
  isCurrentReportLoading: false,
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

  fetchCurrentReportId: async () => {
    set({ isCurrentReportLoading: true });

    try {
      const currentReportId = await getCurrentReportId();
      set({ currentReportId });
      return currentReportId;
    } finally {
      set({ isCurrentReportLoading: false });
    }
  },

  setCurrentReportId: (currentReportId) => set({ currentReportId: currentReportId || null }),

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
      set({ user: null, currentReportId: null });
    }
  },
}));