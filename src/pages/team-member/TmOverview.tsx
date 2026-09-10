import { useEffect, useState } from "react";
import { getTeamMemberOverview } from "../../services/reportService";
import type { TeamMemberOverview as OverviewData } from "../../types/teamMemberOverview";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-50 text-blue-700",
  NEEDS_CORRECTION: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700"
};

export default function TmOverview() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOverview = async () => {
    setIsLoading(true);
    try {
      setOverview(await getTeamMemberOverview());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load overview.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void loadOverview(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isLoading) return <div className="flex h-full min-h-[28rem] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">Loading overview...</div>;
  if (errorMessage || !overview) return <div className="rounded-xl bg-slate-100 p-6 text-sm text-rose-700">{errorMessage ?? "Overview unavailable."}</div>;

  const current = overview.currentReport;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-xl bg-slate-100 p-4 text-slate-800 sm:p-6 scrollbar-hide">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Your workspace</p><h1 className="mt-1 text-2xl font-semibold">Overview</h1><p className="mt-1 text-sm text-slate-500">A quick look at your reporting activity.</p></div>
        <button type="button" onClick={() => void loadOverview()} disabled={isLoading} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-700">Refresh</button>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total reports", overview.totalReports],
          ["Tasks this week", current?.tasksCompleted ?? 0],
          ["Hours this week", current?.totalHours ?? 0],
          ["Open blockers", current?.blockers ?? 0]
        ].map(([label, value]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className="mt-2 text-3xl font-semibold text-slate-800">{value}</p></article>)}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-slate-700">Current report</h2><p className="mt-1 text-xs text-slate-500">{current?.project.name ?? "No report for this week"}</p></div>{current && <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusStyles[current.status]}`}>{current.status.replace("_", " ")}</span>}</div>
        {current && <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-4"><div><span className="text-xs text-slate-400">Achievements</span><p className="font-semibold">{current.achievements}</p></div><div><span className="text-xs text-slate-400">Week starts</span><p className="font-semibold">{new Date(current.weekStart).toLocaleDateString()}</p></div><div><span className="text-xs text-slate-400">Week ends</span><p className="font-semibold">{new Date(current.weekEnd).toLocaleDateString()}</p></div><div><span className="text-xs text-slate-400">Report ID</span><p className="font-semibold">#{current.id}</p></div></div>}
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-semibold text-slate-700">Recent reports</h2><div className="mt-3 divide-y divide-slate-100">{overview.recentReports.map((report) => <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><div><p className="font-medium text-slate-700">{report.project.name}</p><p className="text-xs text-slate-500">{new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyles[report.status]}`}>{report.status.replace("_", " ")}</span></div>)}</div></section>
    </div>
  );
}