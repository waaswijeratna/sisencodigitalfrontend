import type { ReportStatus } from "./report";

export interface AdminOverview {
  period: {
    weekStart: string;
    weekEnd: string;
  };
  summaryMetrics: {
    totalReportsSubmittedThisWeek: { value: number; description: string };
    submissionComplianceRate: {
      submittedCount: number;
      pendingCount: number;
      lateCount: number;
      compliancePercentage: number;
      description: string;
    };
    needsCorrectionReportsCount: { value: number; description: string };
    openBlockersCount: { value: number; description: string };
  };
  charts: {
    tasksCompletedTrend: Array<{ weekStart: string; userId: number; userName: string; tasksCompleted: number }>;
    reportStatusByTeamMember: Array<{
      userId: number;
      userName: string;
      draft: number;
      submitted: number;
      needsCorrection: number;
      approved: number;
    }>;
    workloadByProject: Array<{
      projectId: number;
      projectName: string;
      taskCount: number;
    }>;
    timeSpentByTaskType: Array<{
      taskType: string;
      hours: number;
    }>;
  };
  recentActivity: Array<{
    type: "REPORT_CREATED" | "REPORT_APPROVED" | "CHANGES_REQUESTED";
    reportId: number;
    user: { id: number; name: string };
    project: { name: string };
    status?: ReportStatus;
    action?: "APPROVED" | "REQUESTED_CHANGES";
    comment?: string | null;
    reviewer?: { id: number; name: string };
    createdAt: string;
  }>;
}