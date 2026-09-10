
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { getAdminOverview } from "../../services/adminOverviewService";
import type { AdminOverview as AdminOverviewData } from "../../types/adminOverview";

const chartColors = ["#0891b2", "#10b981", "#f59e0b", "#f43f5e", "#6366f1"];

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }
  return error instanceof Error ? error.message : "Unable to load overview.";
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function MetricCard({ label, value, detail, tone }: { label: string; value: number; detail: string; tone: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 h-1.5 w-12 rounded-full ${tone}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-4 text-sm font-semibold text-slate-700">{title}</h2>
      <div className="h-64">{children}</div>
    </section>
  );
}

export default function AdminOverview() {
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOverview = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setOverview(await getAdminOverview());
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadOverview();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return <div className="flex h-full min-h-[28rem] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">Loading overview...</div>;
  }

  if (errorMessage || !overview) {
    return <div className="rounded-xl bg-slate-100 p-6 text-sm text-rose-700">{errorMessage ?? "Overview is unavailable."}</div>;
  }

  const { summaryMetrics, charts, recentActivity } = overview;
  const compliance = summaryMetrics.submissionComplianceRate;
  const complianceData = [
    { name: "Submitted", value: compliance.submittedCount },
    { name: "Pending", value: compliance.pendingCount },
    { name: "Late", value: compliance.lateCount }
  ];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-xl bg-slate-100 p-4 text-slate-800 sm:p-6 scrollbar-hide">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Admin workspace</p>
          <h1 className="mt-1 text-2xl font-semibold">Team reporting overview</h1>
          <p className="mt-1 text-sm text-slate-500">{formatDate(overview.period.weekStart)} - {formatDate(overview.period.weekEnd)}</p>
        </div>
        <button type="button" onClick={() => void loadOverview()} disabled={isLoading} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-700 disabled:opacity-50">{isLoading ? "Loading..." : "Refresh"}</button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Reports this week" value={summaryMetrics.totalReportsSubmittedThisWeek.value} detail={summaryMetrics.totalReportsSubmittedThisWeek.description} tone="bg-cyan-500" />
        <MetricCard label="Compliance rate" value={compliance.compliancePercentage} detail={compliance.description} tone="bg-emerald-500" />
        <MetricCard label="Needs correction" value={summaryMetrics.needsCorrectionReportsCount.value} detail={summaryMetrics.needsCorrectionReportsCount.description} tone="bg-amber-500" />
        <MetricCard label="Open blockers" value={summaryMetrics.openBlockersCount.value} detail={summaryMetrics.openBlockersCount.description} tone="bg-rose-500" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Tasks completed over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.tasksCompletedTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="weekStart" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(value) => formatDate(String(value))} />
              <Line type="monotone" dataKey="tasksCompleted" name="Completed tasks" stroke="#0891b2" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Submission compliance">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={complianceData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} label>
                {complianceData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Report status by team member">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.reportStatusByTeamMember} layout="vertical" margin={{ left: 20, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="userName" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="submitted" stackId="status" fill="#0891b2" name="Submitted" />
              <Bar dataKey="approved" stackId="status" fill="#10b981" name="Approved" />
              <Bar dataKey="draft" stackId="status" fill="#94a3b8" name="Draft" />
              <Bar dataKey="needsCorrection" stackId="status" fill="#f59e0b" name="Needs correction" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Task distribution by project">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.workloadByProject}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="projectName" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="taskCount" fill="#6366f1" name="Tasks" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Time spent by task type" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.timeSpentByTaskType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="taskType" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="hours" fill="#f43f5e" name="Hours" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700">Recent activity</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {recentActivity.length === 0 ? <p className="py-4 text-sm text-slate-500">No recent activity.</p> : recentActivity.map((activity) => (
            <div key={`${activity.type}-${activity.reportId}-${activity.createdAt}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium text-slate-700">{activity.type === "REPORT_APPROVED" ? "Report approved" : activity.type === "CHANGES_REQUESTED" ? "Changes requested" : "Report created"}</p>
                <p className="mt-1 text-xs text-slate-500">{activity.user.name} · {activity.project.name}{activity.reviewer ? ` · by ${activity.reviewer.name}` : ""}</p>
              </div>
              <time className="text-xs text-slate-400">{new Date(activity.createdAt).toLocaleString()}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}