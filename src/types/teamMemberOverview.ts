import type { ReportStatus } from "./report";

export interface TeamMemberOverview {
  totalReports: number;
  currentReport: {
    id: number;
    status: ReportStatus;
    weekStart: string;
    weekEnd: string;
    project: { id: number; name: string };
    tasksCompleted: number;
    blockers: number;
    achievements: number;
    totalHours: number;
  } | null;
  recentReports: Array<{
    id: number;
    status: ReportStatus;
    weekStart: string;
    weekEnd: string;
    project: { id: number; name: string };
  }>;
}