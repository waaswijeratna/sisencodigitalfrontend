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
}

export interface ReportVersion {
  id: number;
  versionNumber: number;
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
  adminMessages: AdminMessage[];
}

export interface Project {
  id: number;
  name: string;
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