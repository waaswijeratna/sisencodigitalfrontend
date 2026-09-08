import type { ReportSummary } from "../../types/report";

interface ReportCardProps {
  report: ReportSummary;
  onClick: () => void;
}

const statusStyles: Record<ReportSummary["status"], string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-50 text-blue-700",
  NEEDS_CORRECTION: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700"
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

export default function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <article
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Weekly report</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-800">{report.project.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusStyles[report.status]}`}>
          {report.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Tasks</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{report.tasksCompletedCount}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Hours</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{report.totalWorkedHours}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Blockers</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{report.blockers.length}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Achievements</p>
          <p className="mt-1 text-lg font-semibold text-slate-700">{report.achievements.length}</p>
        </div>
      </div>
    </article>
  );
}