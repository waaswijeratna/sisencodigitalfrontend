import api from "../api/axios";
import type { AdminOverview } from "../types/adminOverview";

export const getAdminOverview = async () => {
  const response = await api.get<{ overview: AdminOverview }>("/admin/overview");
  return response.data.overview;
};