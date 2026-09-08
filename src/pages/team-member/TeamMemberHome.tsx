import { useState, useRef } from "react";
import Profile from "../../components/profile";
import TmOverview from "./TmOverview";
import TmHistory from "./TmHistory";
import Report from "./report";
import { useAuthStore } from "../../stores/authStore";
import { LayoutDashboardIcon, HistoryIcon, FileTextIcon} from "@animateicons/react/lucide";

import type { LayoutDashboardIconHandle, HistoryIconHandle, FileTextIconHandle } from "@animateicons/react/lucide";

type NavigationTab = "overview" | "history" | "reports";

export default function TeamMemberHome() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("overview");
  const [reportRefreshKey, setReportRefreshKey] = useState(0);
  const currentReportId = useAuthStore((state) => state.currentReportId);
  const isCurrentReportLoading = useAuthStore((state) => state.isCurrentReportLoading);
  const fetchCurrentReportId = useAuthStore((state) => state.fetchCurrentReportId);
  const setCurrentReportId = useAuthStore((state) => state.setCurrentReportId);

  const refreshReport = async () => {
    await fetchCurrentReportId();
    setReportRefreshKey((key) => key + 1);
  };

  const overviewIconRef = useRef<LayoutDashboardIconHandle>(null);
  const historyIconRef = useRef<HistoryIconHandle>(null);
  const reportsIconRef = useRef<FileTextIconHandle>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <TmOverview />;
      case "history":
        return <TmHistory />;
      case "reports":
        return <Report reportId={currentReportId} isReportIdLoading={isCurrentReportLoading} refreshKey={reportRefreshKey} onRefresh={refreshReport} onReportCreated={setCurrentReportId} />;
      default:
        return <TmOverview />;
    }
  };

  return (
    <main className="flex min-h-screen text-sm bg-mist-950 text-cyan-50">
      <aside className="flex h-screen w-[15vw] flex-col justify-between p-4">
        <div>
          <div className="text-xl font-bold tracking-wider text-cyan-400">
            LOGO
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {/* Overview Button */}
          <button
            onClick={() => setActiveTab("overview")}
            onMouseEnter={() => overviewIconRef.current?.startAnimation()}
            onMouseLeave={() => overviewIconRef.current?.stopAnimation()}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-100"
            }`}
          >
            <LayoutDashboardIcon ref={overviewIconRef} size={20} color="currentColor" />
            <span>Overview</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setActiveTab("history")}
            onMouseEnter={() => historyIconRef.current?.startAnimation()}
            onMouseLeave={() => historyIconRef.current?.stopAnimation()}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-100"
            }`}
          >
            <HistoryIcon ref={historyIconRef} size={20} color="currentColor" />
            <span>History</span>
          </button>

          {/* Reports Button */}
          <button
            onClick={() => {
              setActiveTab("reports");
              void fetchCurrentReportId();
            }}
            onMouseEnter={() => reportsIconRef.current?.startAnimation()}
            onMouseLeave={() => reportsIconRef.current?.stopAnimation()}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "reports"
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-100"
            }`}
          >
            <FileTextIcon ref={reportsIconRef} size={20} color="currentColor" />
            <span>Reports</span>
          </button>
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <Profile />
        </div>
      </aside>

      <section className="h-screen w-full overflow-y-auto p-2">
        {renderContent()}
      </section>
    </main>
  );
}