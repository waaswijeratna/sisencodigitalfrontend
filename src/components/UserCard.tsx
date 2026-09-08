import type { TeamMember } from "../types/report";

interface UserCardProps {
  user: TeamMember;
  onClick: () => void;
}

const statusStyles: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  SUBMITTED: "bg-blue-50 text-blue-700",
  NEEDS_CORRECTION: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700"
};

export default function UserCard({ user, onClick }: UserCardProps) {
  const report = user.latestReport;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-800">{user.name}</p>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] ${report ? statusStyles[report.status] : "bg-slate-100 text-slate-500"}`}>
          {report ? report.status.replace("_", " ") : "No report"}
        </span>
      </div>

      {report ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-rose-50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-500">Blockers</p>
            {report.blockers.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm leading-5 text-slate-700">
                {report.blockers.map((blocker) => <li key={blocker.description}>• {blocker.description}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No blockers reported.</p>
            )}
          </div>
          <div className="rounded-xl bg-emerald-50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Achievements</p>
            {report.achievements.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm leading-5 text-slate-700">
                {report.achievements.map((achievement) => <li key={achievement.description}>• {achievement.description}</li>)}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No achievements reported.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500">No reports submitted yet.</p>
      )}
    </article>
  );
}