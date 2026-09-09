import type {
  AdminMessage,
  PreviousReportVersion,
  ReportVersion
} from "../types/report";

interface VersionViewProps {
  latestVersion: ReportVersion;
  previousVersions: PreviousReportVersion[];
  adminMessages: AdminMessage[];
}

const formatDate = (value: string | null) => {
  if (!value) return "Not submitted";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

const statusLabel = (action: AdminMessage["action"]) =>
  action === "APPROVED" ? "Approved" : "Changes requested";

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function ReviewNote({ message }: { message: AdminMessage }) {
  return (
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-amber-700">
        <span className="font-semibold">{statusLabel(message.action)}</span>
        <span className="text-amber-700/70">{formatDate(message.createdAt)}</span>
      </div>
      {message.message && <p className="mt-2 leading-5 text-amber-800">{message.message}</p>}
      <p className="mt-2 text-amber-700/70">Reviewed by {message.reviewer.name}</p>
    </div>
  );
}

function VersionEntry({
  versionNumber,
  createdAt,
  submittedAt,
  isCurrent,
  children,
  reviewMessages
}: {
  versionNumber: number;
  createdAt: string;
  submittedAt?: string | null;
  isCurrent: boolean;
  children: React.ReactNode;
  reviewMessages: AdminMessage[];
}) {
  return (
    <article className="relative pl-8 sm:pl-10">
      <span className={`absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white ${isCurrent ? "bg-cyan-500" : "bg-slate-300"}`} aria-hidden="true" />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-700">Version {versionNumber}</h3>
              {isCurrent && <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700">Current</span>}
            </div>
            <p className="mt-1 text-xs text-slate-500">Created {formatDate(createdAt)}</p>
          </div>
          <p className="text-xs text-slate-500">{submittedAt ? `Submitted ${formatDate(submittedAt)}` : "Draft version"}</p>
        </div>
        <div className="mt-4">{children}</div>
        {reviewMessages.map((message) => <ReviewNote key={message.id} message={message} />)}
      </div>
    </article>
  );
}

export default function VersionView({ latestVersion, previousVersions, adminMessages }: VersionViewProps) {
  const versions = [...previousVersions].sort((first, second) => second.versionNumber - first.versionNumber);
  const currentReviewMessages = adminMessages.filter((message) => message.versionId === latestVersion.id);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Report history</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-800">Version timeline</h2>
        </div>
        <p className="text-xs text-slate-500">{previousVersions.length + 1} version{previousVersions.length === 0 ? "" : "s"}</p>
      </div>

      <div className="relative space-y-5 before:absolute before:bottom-4 before:left-[9px] before:top-2 before:w-px before:bg-slate-200">
        <VersionEntry
          versionNumber={latestVersion.versionNumber}
          createdAt={latestVersion.createdAt}
          submittedAt={latestVersion.submittedAt}
          isCurrent
          reviewMessages={currentReviewMessages}
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Metric label="Completed tasks" value={latestVersion.tasks.length} />
            <Metric label="Next-week tasks" value={latestVersion.nextTasks.length} />
            <Metric label="Blockers" value={latestVersion.blockers.length} />
            <Metric label="Achievements" value={latestVersion.achievements.length} />
          </div>
          {latestVersion.hours && <p className="mt-3 text-xs text-slate-500">Total worked hours: <span className="font-semibold text-slate-700">{latestVersion.hours.totalHours}</span></p>}
        </VersionEntry>

        {versions.map((version) => (
          <VersionEntry
            key={version.id}
            versionNumber={version.versionNumber}
            createdAt={version.createdAt}
            submittedAt={version.submittedAt}
            isCurrent={false}
            reviewMessages={adminMessages.filter((message) => message.versionId === version.id)}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="Completed tasks" value={version.tasksCompletedCount} />
              <Metric label="Worked hours" value={version.totalWorkedHours} />
              <Metric label="Blockers" value={version.blockersCount} />
              <Metric label="Achievements" value={version.achievementsCount} />
            </div>
          </VersionEntry>
        ))}
      </div>
    </section>
  );
}