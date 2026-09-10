import { useEffect, useState } from "react";
import Report from "../../components/report";
import { useAuthStore } from "../../stores/authStore";

export default function TmReport() {
  const [reportRefreshKey, setReportRefreshKey] = useState(0);
  const currentReportId = useAuthStore((state) => state.currentReportId);
  const isCurrentReportLoading = useAuthStore((state) => state.isCurrentReportLoading);
  const fetchCurrentReportId = useAuthStore((state) => state.fetchCurrentReportId);
  const setCurrentReportId = useAuthStore((state) => state.setCurrentReportId);

  useEffect(() => {
    void fetchCurrentReportId();
  }, [fetchCurrentReportId]);

  const refreshReport = async () => {
    await fetchCurrentReportId();
    setReportRefreshKey((key) => key + 1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto rounded-xl bg-slate-100 p-4 text-slate-800 sm:p-6 scrollbar-hide">
      <Report
        reportId={currentReportId}
        isReportIdLoading={isCurrentReportLoading}
        refreshKey={reportRefreshKey}
        onRefresh={refreshReport}
        onReportCreated={setCurrentReportId}
      />
    </div>
  );
}