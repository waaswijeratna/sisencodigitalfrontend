import { useCallback, useEffect, useState } from "react";
import ReportCard from "./ReportCard";
import Report from "./report";
import { getReports } from "../services/reportService";
import type { ReportListFilters, ReportStatus, ReportSummary } from "../types/report";

const statuses: Array<{ value: ReportStatus; label: string }> = [
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "NEEDS_CORRECTION", label: "Needs correction" },
  { value: "APPROVED", label: "Approved" }
];

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }
  return error instanceof Error ? error.message : "Unable to load reports.";
};

export default function AllReports() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [filters, setFilters] = useState<ReportListFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [modalRefreshKey, setModalRefreshKey] = useState(0);

  const loadReports = useCallback(async (nextFilters: ReportListFilters) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setReports(await getReports(nextFilters));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadReports(filters);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [filters, loadReports]);

  const updateFilter = (key: keyof ReportListFilters, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => setFilters({});

  const refreshModalReport = async () => {
    setModalRefreshKey((key) => key + 1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl bg-slate-100 p-4 sm:p-6">
      <header className="shrink-0 border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Archive</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-800">Report history</h2>
            <p className="mt-1 text-sm text-slate-500">Review your submitted weekly reports.</p>
          </div>
          <button type="button" onClick={() => void loadReports(filters)} disabled={isLoading} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-700 disabled:opacity-50">
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="history-date">By date</label>
            <input id="history-date" type="date" value={filters.date ?? ""} onChange={(event) => updateFilter("date", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="history-from">From date</label>
            <input id="history-from" type="date" value={filters.fromDate ?? ""} onChange={(event) => updateFilter("fromDate", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="history-to">To date</label>
            <input id="history-to" type="date" value={filters.toDate ?? ""} onChange={(event) => updateFilter("toDate", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="history-status">Status</label>
            <select id="history-status" value={filters.status ?? ""} onChange={(event) => updateFilter("status", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-500">
              <option value="">All statuses</option>
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </div>
        </div>
        {(filters.date || filters.fromDate || filters.toDate || filters.status) && <button type="button" onClick={clearFilters} className="mt-3 text-xs font-semibold text-cyan-700 hover:text-cyan-900">Clear filters</button>}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pt-5">
        {errorMessage && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}
        {!isLoading && !errorMessage && reports.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">No reports match the selected filters.</div>}
        <div className="grid gap-4 lg:grid-cols-2">{reports.map((report) => <ReportCard key={report.id} report={report} onClick={() => setSelectedReportId(report.id)} />)}</div>
      </div>

      {selectedReportId !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Report details">
          <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-slate-950 p-3 shadow-2xl sm:p-5">
            <button
              type="button"
              onClick={() => setSelectedReportId(null)}
              className="sticky right-0 top-0 z-10 float-right rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
              aria-label="Close report"
            >
              Close
            </button>
            <Report
              reportId={selectedReportId}
              isReportIdLoading={false}
              refreshKey={modalRefreshKey}
              onRefresh={refreshModalReport}
              onReportCreated={(reportId) => {
                if (reportId === 0) setSelectedReportId(null);
                else setSelectedReportId(reportId);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}