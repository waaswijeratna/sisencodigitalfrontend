import api from "../api/axios";
import type { Project, ReportDetails, ReportPayload } from "../types/report";

export const getCurrentReportId = async () => {
  const response = await api.get<{ reportId: number | null }>("/reports/me");
  return response.data.reportId;
};

export const getReportById = async (reportId: number) => {
  const response = await api.get<{ report: ReportDetails }>(`/reports/${reportId}`);
  return response.data.report;
};

export const getActiveProjects = async () => {
  const response = await api.get<{ projects: Project[] }>("/projects");
  return response.data.projects;
};

export const createReport = async (payload: Required<Pick<ReportPayload, "projectId" | "weekStart" | "weekEnd">> & ReportPayload) => {
  const response = await api.post<{ report: ReportDetails }>("/reports", payload);
  return response.data.report;
};

export const updateDraftReport = async (reportId: number, payload: ReportPayload) => {
  const response = await api.patch<{ report: ReportDetails }>(`/reports/${reportId}`, payload);
  return response.data.report;
};

export const submitReport = async (reportId: number, payload: ReportPayload) => {
  const response = await api.patch<{ report: ReportDetails }>(`/reports/${reportId}/submit`, payload);
  return response.data.report;
};

export const deleteDraftReport = async (reportId: number) => {
  await api.delete(`/reports/${reportId}`);
};