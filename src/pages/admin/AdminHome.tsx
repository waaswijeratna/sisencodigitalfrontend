import { useState, useRef } from "react";
import Profile from "../../components/profile";
import AdminOverview from "./AdminOverview";
import AdminReports from "./AdminReports";
import AdminTeamMembers from "./AdminTeamMembers";
import AdminProjects from "./AdminProjects";
import { LayoutDashboardIcon, FileTextIcon, Users, LayoutList } from "@animateicons/react/lucide";

import type { 
  LayoutDashboardIconHandle, 
  FileTextIconHandle, 
  UsersHandle, 
  LayoutListHandle 
} from "@animateicons/react/lucide";

type NavigationTab = "overview" | "reports" | "team" | "projects";

export default function AdminHome() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("overview");

  const overviewIconRef = useRef<LayoutDashboardIconHandle>(null);
  const reportsIconRef = useRef<FileTextIconHandle>(null);
  const teamIconRef = useRef<UsersHandle>(null);
  const projectsIconRef = useRef<LayoutListHandle>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "reports":
        return <AdminReports />;
      case "team":
        return <AdminTeamMembers />;
      case "projects":
        return <AdminProjects />;
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

          {/* Reports Button */}
          <button
            onClick={() => setActiveTab("reports")}
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

          {/* Team Members Button */}
          <button
            onClick={() => setActiveTab("team")}
            onMouseEnter={() => teamIconRef.current?.startAnimation()}
            onMouseLeave={() => teamIconRef.current?.stopAnimation()}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "team"
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-100"
            }`}
          >
            <Users ref={teamIconRef} size={20} color="currentColor" />
            <span>Team</span>
          </button>

          {/* Projects Button */}
          <button
            onClick={() => setActiveTab("projects")}
            onMouseEnter={() => projectsIconRef.current?.startAnimation()}
            onMouseLeave={() => projectsIconRef.current?.stopAnimation()}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              activeTab === "projects"
                ? "text-cyan-50"
                : "text-slate-400 hover:text-cyan-100"
            }`}
          >
            <LayoutList ref={projectsIconRef} size={20} color="currentColor" />
            <span>Projects</span>
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