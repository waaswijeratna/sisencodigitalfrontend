import { useEffect, useState } from "react";
import Report from "./report";
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
    <Report
      reportId={currentReportId}
      isReportIdLoading={isCurrentReportLoading}
      refreshKey={reportRefreshKey}
      onRefresh={refreshReport}
      onReportCreated={setCurrentReportId}
    />
  );
}