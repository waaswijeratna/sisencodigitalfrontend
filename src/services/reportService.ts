import api from "../api/axios";
import type {
  Project,
  ReportDetails,
  ReportListFilters,
  ReportPayload,
  ReportSummary,
  TeamMember
} from "../types/report";

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

export const getReports = async (filters: ReportListFilters = {}) => {
  const response = await api.get<{ reports: ReportSummary[] }>("/reports", {
    params: Object.fromEntries(
      Object.entries(filters).filter(([, value]) => Boolean(value))
    )
  });

  return response.data.reports;
};

export const getProjects = async (includeInactive = false) => {
  const response = await api.get<{ projects: Project[] }>("/projects", {
    params: includeInactive ? { includeInactive: true } : undefined
  });
  return response.data.projects;
};

export const getTeamMembers = async () => {
  const response = await api.get<{ users: TeamMember[] }>("/auth/team-members");
  return response.data.users;
};

export const reviewReport = async (
  reportId: number,
  action: "APPROVED" | "REQUESTED_CHANGES",
  comment?: string
) => {
  const response = await api.patch<{ report: ReportDetails }>(`/reports/${reportId}/review`, {
    action,
    ...(comment?.trim() ? { comment: comment.trim() } : {})
  });
  return response.data.report;
};