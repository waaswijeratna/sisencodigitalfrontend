import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import Snackbar, { type SnackbarTone } from "./Snackbar";
import VersionView from "./VersionView";
import {
  createReport,
  deleteDraftReport,
  getActiveProjects,
  getReportById,
  reviewReport,
  submitReport,
  updateDraftReport
} from "../services/reportService";
import type {
  Achievement,
  Blocker,
  NextWeekTask,
  ReportDetails,
  ReportHours,
  ReportPayload,
  ReportTask,
  TaskPriority,
  TaskStatus
} from "../types/report";

interface ReportFormValues {
  projectId: number;
  weekStart: string;
  weekEnd: string;
  tasksCompleted: ReportTask[];
  nextWeekTasks: NextWeekTask[];
  blockers: Blocker[];
  achievements: Achievement[];
  hours: ReportHours;
}

interface ReportProps {
  reportId: number | null;
  isReportIdLoading: boolean;
  refreshKey: number;
  onRefresh: () => Promise<void>;
  onReportCreated: (reportId: number) => void;
  readOnly?: boolean;
  adminReviewMode?: boolean;
}

const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const taskStatuses: TaskStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "BLOCKED"];

const getWeekDefaults = () => {
  const today = new Date();
  const day = today.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  start.setUTCDate(start.getUTCDate() + mondayOffset);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  return {
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10)
  };
};

const emptyValues = (): ReportFormValues => ({
  projectId: 0,
  ...getWeekDefaults(),
  tasksCompleted: [],
  nextWeekTasks: [],
  blockers: [],
  achievements: [],
  hours: {
    development: 0,
    testing: 0,
    meetings: 0,
    documentation: 0,
    other: 0
  }
});

const toFormValues = (report: ReportDetails): ReportFormValues => {
  const version = report.latestVersion;

  return {
    projectId: report.project.id,
    weekStart: report.weekStart.slice(0, 10),
    weekEnd: report.weekEnd.slice(0, 10),
    tasksCompleted: version.tasks,
    nextWeekTasks: version.nextTasks,
    blockers: version.blockers,
    achievements: version.achievements,
    hours: version.hours ?? emptyValues().hours
  };
};

const toPayload = (values: ReportFormValues): ReportPayload => ({
  projectId: values.projectId || undefined,
  weekStart: values.weekStart,
  weekEnd: values.weekEnd,
  tasksCompleted: values.tasksCompleted,
  nextWeekTasks: values.nextWeekTasks,
  blockers: values.blockers,
  achievements: values.achievements,
  hours: values.hours
});

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }

  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
};

function SectionTitle({ title, count }: { title: string; count?: number }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {count !== undefined && <span className="text-xs text-slate-500">{count} entries</span>}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{children}</label>;
}

const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-55";
const cardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

export default function Report({ reportId, isReportIdLoading, refreshKey, onRefresh, onReportCreated, readOnly = false, adminReviewMode = false }: ReportProps) {
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [projects, setProjects] = useState<{ id: number; name: string; isActive: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [snackbar, setSnackbar] = useState<{ message: string; tone: SnackbarTone } | null>(null);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isDirty }
  } = useForm<ReportFormValues>({ defaultValues: emptyValues() });

  const tasks = useFieldArray({ control, name: "tasksCompleted" });
  const nextTasks = useFieldArray({ control, name: "nextWeekTasks" });
  const blockers = useFieldArray({ control, name: "blockers" });
  const achievements = useFieldArray({ control, name: "achievements" });
  const watched = useWatch({ control });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      try {
        const loadedProjects = await getActiveProjects();
        if (!cancelled) setProjects(loadedProjects);

        if (reportId !== null) {
          const loadedReport = await getReportById(reportId);
          if (!cancelled) {
            setReport(loadedReport);
            reset(toFormValues(loadedReport));
          }
        } else if (!cancelled) {
          setReport(null);
          reset(emptyValues());
        }
      } catch (error) {
        if (!cancelled) setSnackbar({ message: getErrorMessage(error), tone: "error" });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [reportId, refreshKey, reset]);

  const status = report?.status ?? null;
  const canEdit = !readOnly && (status === null || status === "DRAFT" || status === "NEEDS_CORRECTION");
  const canSave = !readOnly && (status === null || status === "DRAFT");
  const canSubmit = !readOnly && (status === "DRAFT" || status === "NEEDS_CORRECTION");
  const canDelete = !readOnly && status === "DRAFT";
  const hasFormData = useMemo(() => {
    const hasHours = Object.values(watched.hours ?? {}).some((value) => Number(value) > 0);
    return Boolean(
      watched.projectId ||
      watched.tasksCompleted?.some((task) => task.taskName?.trim()) ||
      watched.nextWeekTasks?.some((task) => task.taskName?.trim()) ||
      watched.blockers?.some((blocker) => blocker.description?.trim()) ||
      watched.achievements?.some((achievement) => achievement.description?.trim()) ||
      hasHours
    );
  }, [watched]);
  const saveEnabled = canSave && (reportId !== null || hasFormData);
  const submitEnabled = canSubmit && reportId !== null;
  const canReview = adminReviewMode && status === "SUBMITTED" && reportId !== null;
  const latestCorrection = report?.adminMessages.find(
    (message) => message.action === "REQUESTED_CHANGES"
  );

  const save = async (values: ReportFormValues) => {
    if (!canSave || (!reportId && !hasFormData)) return;

    setIsSaving(true);
    setSnackbar(null);

    try {
      const payload = toPayload(values);
      if (reportId === null) {
        if (!payload.projectId || !payload.weekStart || !payload.weekEnd) {
          setSnackbar({ message: "Choose a project before saving your report.", tone: "error" });
          return;
        }
        const created = await createReport(payload as Required<Pick<ReportPayload, "projectId" | "weekStart" | "weekEnd">> & ReportPayload);
        onReportCreated(created.id);
        setSnackbar({ message: "Draft saved.", tone: "success" });
      } else {
        await updateDraftReport(reportId, payload);
        setSnackbar({ message: "Draft updated.", tone: "success" });
      }
    } catch (error) {
      setSnackbar({ message: getErrorMessage(error), tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const submit = async (values: ReportFormValues) => {
    if (!reportId || !canSubmit) return;

    setIsSaving(true);
    setSnackbar(null);

    try {
      await submitReport(reportId, toPayload(values));
      const submitted = await getReportById(reportId);
      setReport(submitted);
      reset(toFormValues(submitted));
      setSnackbar({ message: "Report submitted for review.", tone: "success" });
    } catch (error) {
      setSnackbar({ message: getErrorMessage(error), tone: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async () => {
    if (!reportId || !canDelete) return;
    setIsDeleting(true);
    setSnackbar(null);

    try {
      await deleteDraftReport(reportId);
      setReport(null);
      reset(emptyValues());
      onReportCreated(0);
      setSnackbar({ message: "Draft deleted. You can start a new report.", tone: "success" });
    } catch (error) {
      setSnackbar({ message: getErrorMessage(error), tone: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const review = async (action: "APPROVED" | "REQUESTED_CHANGES") => {
    if (!reportId || !canReview) return;

    if (action === "REQUESTED_CHANGES" && !reviewComment.trim()) {
      setSnackbar({ message: "Add a message before requesting changes.", tone: "error" });
      return;
    }

    setIsReviewing(true);
    setSnackbar(null);

    try {
      await reviewReport(reportId, action, reviewComment);
      const reviewedReport = await getReportById(reportId);
      setReport(reviewedReport);
      reset(toFormValues(reviewedReport));
      setReviewComment("");
      setSnackbar({
        message: action === "APPROVED" ? "Report approved." : "Changes requested.",
        tone: "success"
      });
    } catch (error) {
      setSnackbar({ message: getErrorMessage(error), tone: "error" });
    } finally {
      setIsReviewing(false);
    }
  };

  if (isReportIdLoading || isLoading) {
    return <div className="flex h-full min-h-[28rem] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">Loading this week&apos;s report...</div>;
  }

  return (
    <div className="mx-auto min-h-full max-w-6xl pb-8 text-slate-800">
      <Snackbar message={snackbar?.message ?? null} tone={snackbar?.tone ?? "success"} onClose={() => setSnackbar(null)} />
      <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Weekly report</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">This week&apos;s progress</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Capture completed work, plan the next week, and send it to your reviewer when ready.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="w-fit rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">{status.replace("_", " ")}</span>}
          <button
            type="button"
            onClick={() => void onRefresh()}
            disabled={isReportIdLoading || isLoading || isSaving || isDeleting || isReviewing}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-cyan-400 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40"
            title="Refresh report"
          >
            Refresh
          </button>
        </div>
      </header>

      {status === "NEEDS_CORRECTION" && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          <p className="font-semibold">Your reviewer requested changes.</p>
          <p className="mt-1 text-amber-700">Update the report and submit it again.</p>
          {latestCorrection?.message && (
            <blockquote className="mt-3 border-l-2 border-amber-300 pl-3 text-amber-900">
              <p>{latestCorrection.message}</p>
              <footer className="mt-2 text-xs text-amber-700">
                {latestCorrection.reviewer.name} · {new Date(latestCorrection.createdAt).toLocaleString()}
              </footer>
            </blockquote>
          )}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit(save)}>
        <section className={cardClass}>
          <SectionTitle title="Report details" />
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <FieldLabel>Project</FieldLabel>
              <select className={inputClass} disabled={!canEdit || Boolean(reportId)} {...register("projectId", { valueAsNumber: true })}>
                <option value={0}>Select a project</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Week starts</FieldLabel>
              <input className={inputClass} type="date" disabled={!canEdit || Boolean(reportId)} {...register("weekStart")} />
            </div>
            <div>
              <FieldLabel>Week ends</FieldLabel>
              <input className={inputClass} type="date" disabled={!canEdit || Boolean(reportId)} {...register("weekEnd")} />
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <SectionTitle title="Completed work" count={tasks.fields.length} />
          <div className="space-y-3">
            {tasks.fields.map((field, index) => (
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4" key={field.id}>
                <div className="md:col-span-2"><FieldLabel>Task name</FieldLabel><input className={inputClass} disabled={!canEdit} {...register(`tasksCompleted.${index}.taskName`)} /></div>
                <div><FieldLabel>Priority</FieldLabel><select className={inputClass} disabled={!canEdit} {...register(`tasksCompleted.${index}.priority`)}>{priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></div>
                <div><FieldLabel>Status</FieldLabel><select className={inputClass} disabled={!canEdit} {...register(`tasksCompleted.${index}.status`)}>{taskStatuses.map((taskStatus) => <option key={taskStatus} value={taskStatus}>{taskStatus.replace("_", " ")}</option>)}</select></div>
                <div><FieldLabel>Planned %</FieldLabel><input className={inputClass} type="number" min="0" max="100" disabled={!canEdit} {...register(`tasksCompleted.${index}.plannedPercentage`, { valueAsNumber: true })} /></div>
                <div><FieldLabel>Actual %</FieldLabel><input className={inputClass} type="number" min="0" max="100" disabled={!canEdit} {...register(`tasksCompleted.${index}.actualPercentage`, { valueAsNumber: true })} /></div>
                <div><FieldLabel>Planned hours</FieldLabel><input className={inputClass} type="number" min="0" step="0.25" disabled={!canEdit} {...register(`tasksCompleted.${index}.plannedHours`, { valueAsNumber: true })} /></div>
                <div><FieldLabel>Spent hours</FieldLabel><input className={inputClass} type="number" min="0" step="0.25" disabled={!canEdit} {...register(`tasksCompleted.${index}.spentHours`, { valueAsNumber: true })} /></div>
                <div className="md:col-span-3"><FieldLabel>Deliverable</FieldLabel><input className={inputClass} disabled={!canEdit} {...register(`tasksCompleted.${index}.deliverable`)} /></div>
                {canEdit && <button type="button" className="self-end text-left text-xs font-semibold text-rose-600 hover:text-rose-700" onClick={() => tasks.remove(index)}>Remove task</button>}
              </div>
            ))}
          </div>
          {canEdit && <button type="button" className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-cyan-700 hover:border-cyan-400" onClick={() => tasks.append({ taskName: "", priority: "MEDIUM", plannedPercentage: 0, actualPercentage: 0, status: "NOT_STARTED", plannedHours: 0, spentHours: 0, deliverable: "" })}>+ Add completed task</button>}
        </section>

        <section className={cardClass}>
          <SectionTitle title="Next week" count={nextTasks.fields.length} />
          <div className="space-y-3">
            {nextTasks.fields.map((field, index) => <div className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto]" key={field.id}><input className={inputClass} placeholder="Task name" disabled={!canEdit} {...register(`nextWeekTasks.${index}.taskName`)} /><input className={inputClass} placeholder="Description (optional)" disabled={!canEdit} {...register(`nextWeekTasks.${index}.description`)} />{canEdit && <button type="button" className="px-2 text-xs text-rose-600" onClick={() => nextTasks.remove(index)}>Remove</button>}</div>)}
          </div>
          {canEdit && <button type="button" className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-cyan-700 hover:border-cyan-400" onClick={() => nextTasks.append({ taskName: "", description: "" })}>+ Add next-week task</button>}
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className={cardClass}>
            <SectionTitle title="Blockers" count={blockers.fields.length} />
            <div className="space-y-3">{blockers.fields.map((field, index) => <div className="flex gap-3" key={field.id}><input className={inputClass} placeholder="Describe a blocker" disabled={!canEdit} {...register(`blockers.${index}.description`)} /><label className="flex shrink-0 items-center gap-2 text-xs text-slate-500"><input type="checkbox" disabled={!canEdit} {...register(`blockers.${index}.isKeyIssue`)} /> Key issue</label>{canEdit && <button type="button" className="text-xs text-rose-600" onClick={() => blockers.remove(index)}>Remove</button>}</div>)}</div>
            {canEdit && <button type="button" className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-cyan-700 hover:border-cyan-400" onClick={() => blockers.append({ description: "", isKeyIssue: false })}>+ Add blocker</button>}
          </section>
          <section className={cardClass}>
            <SectionTitle title="Achievements" count={achievements.fields.length} />
            <div className="space-y-3">{achievements.fields.map((field, index) => <div className="flex gap-3" key={field.id}><input className={inputClass} placeholder="Describe an achievement" disabled={!canEdit} {...register(`achievements.${index}.description`)} /><label className="flex shrink-0 items-center gap-2 text-xs text-slate-500"><input type="checkbox" disabled={!canEdit} {...register(`achievements.${index}.isKeyAchievement`)} /> Key achievement</label>{canEdit && <button type="button" className="text-xs text-rose-600" onClick={() => achievements.remove(index)}>Remove</button>}</div>)}</div>
            {canEdit && <button type="button" className="mt-4 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-cyan-700 hover:border-cyan-400" onClick={() => achievements.append({ description: "", isKeyAchievement: false })}>+ Add achievement</button>}
          </section>
        </div>

        <section className={cardClass}>
          <SectionTitle title="Hours" />
          <div className="grid gap-3 grid-cols-2 md:grid-cols-5">{(["development", "testing", "meetings", "documentation", "other"] as const).map((field) => <div key={field}><FieldLabel>{field}</FieldLabel><input className={inputClass} type="number" min="0" step="0.25" disabled={!canEdit} {...register(`hours.${field}`, { valueAsNumber: true })} /></div>)}</div>
        </section>

        {canReview && (
          <section className="rounded-2xl border border-cyan-400/25 bg-cyan-400/5 p-5">
            <div>
              <h2 className="text-base font-semibold text-slate-700">Review report</h2>
              <p className="mt-1 text-xs text-slate-500">Approve this report or request changes with a message.</p>
            </div>
            <textarea
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              placeholder="Add a review message"
              rows={3}
              className="mt-4 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            />
            <div className="mt-3 flex flex-wrap justify-end gap-3">
              <button type="button" disabled={isReviewing} onClick={() => void review("REQUESTED_CHANGES")} className="rounded-lg border border-amber-300 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40">
                {isReviewing ? "Updating..." : "Request changes"}
              </button>
              <button type="button" disabled={isReviewing} onClick={() => void review("APPROVED")} className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40">
                {isReviewing ? "Updating..." : "Approve report"}
              </button>
            </div>
          </section>
        )}

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">{adminReviewMode ? "Admin review mode." : status === "SUBMITTED" || status === "APPROVED" ? "This report is view only." : status === "NEEDS_CORRECTION" ? "Submit your corrections when ready." : isDirty ? "Unsaved changes" : "All changes saved"}</div>
          <div className="flex flex-wrap justify-end gap-3">
            {!adminReviewMode && canDelete && <button type="button" disabled={isDeleting || isSaving} onClick={() => void remove()} className="rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40">{isDeleting ? "Deleting..." : "Delete draft"}</button>}
            {!adminReviewMode && <button type="submit" disabled={isSaving || !saveEnabled} className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40">{isSaving ? "Saving..." : "Save as draft"}</button>}
            {!adminReviewMode && <button type="button" disabled={isSaving || !submitEnabled} onClick={() => void handleSubmit(submit)()} className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40">{isSaving ? "Submitting..." : "Submit report"}</button>}
          </div>
        </footer>
      </form>
      {report && (
        <VersionView
          latestVersion={report.latestVersion}
          previousVersions={report.previousVersions}
          adminMessages={report.adminMessages}
        />
      )}
    </div>
  );
}