export type ReportStatus = "DRAFT" | "SUBMITTED" | "NEEDS_CORRECTION" | "APPROVED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";

export interface ReportTask {
  taskName: string;
  priority: TaskPriority;
  plannedPercentage: number;
  actualPercentage: number;
  status: TaskStatus;
  plannedHours: number;
  spentHours: number;
  deliverable?: string | null;
}

export interface NextWeekTask {
  taskName: string;
  description?: string | null;
}

export interface Blocker {
  description: string;
  isKeyIssue: boolean;
}

export interface Achievement {
  description: string;
  isKeyAchievement: boolean;
}

export interface ReportHours {
  development: number;
  testing: number;
  meetings: number;
  documentation: number;
  other: number;
  totalHours?: number;
}

export interface ReportVersion {
  id: number;
  versionNumber: number;
  submittedAt: string | null;
  createdAt: string;
  tasks: ReportTask[];
  nextTasks: NextWeekTask[];
  blockers: Blocker[];
  achievements: Achievement[];
  hours: ReportHours | null;
}

export interface AdminMessage {
  id: number;
  versionId: number;
  action: "APPROVED" | "REQUESTED_CHANGES";
  message: string | null;
  createdAt: string;
  reviewer: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PreviousReportVersion {
  id: number;
  versionNumber: number;
  submittedAt: string | null;
  createdAt: string;
  tasksCompletedCount: number;
  totalWorkedHours: number;
  blockersCount: number;
  achievementsCount: number;
}

export interface ReportDetails {
  id: number;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
  project: {
    id: number;
    name: string;
    description?: string | null;
  };
  latestVersion: ReportVersion;
  previousVersions: PreviousReportVersion[];
  adminMessages: AdminMessage[];
}

export interface ReportSummary {
  id: number;
  weekStart: string;
  weekEnd: string;
  status: ReportStatus;
  user: {
    id: number;
    name: string;
    email: string;
  };
  project: {
    id: number;
    name: string;
  };
  tasksCompletedCount: number;
  totalWorkedHours: number;
  blockers: Blocker[];
  achievements: Achievement[];
}

export interface ReportListFilters {
  date?: string;
  fromDate?: string;
  toDate?: string;
  status?: ReportStatus;
  teamMemberId?: number;
  projectId?: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface ReportPayload {
  projectId?: number;
  weekStart?: string;
  weekEnd?: string;
  tasksCompleted: ReportTask[];
  nextWeekTasks: NextWeekTask[];
  blockers: Blocker[];
  achievements: Achievement[];
  hours: ReportHours;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  latestReport: {
    id: number;
    weekStart: string;
    weekEnd: string;
    status: ReportStatus;
    blockers: Blocker[];
    achievements: Achievement[];
  } | null;
}

