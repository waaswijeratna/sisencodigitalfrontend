
import { useEffect, useState } from "react";
import AllReports from "../../components/AllReports";
import UserCard from "../../components/UserCard";
import { getTeamMembers } from "../../services/reportService";
import type { TeamMember } from "../../types/report";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } }).response;
    if (typeof response?.data?.message === "string") return response.data.message;
  }
  return error instanceof Error ? error.message : "Unable to load team members.";
};

export default function AdminTeamMembers() {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void getTeamMembers()
      .then(setUsers)
      .catch((error: unknown) => setErrorMessage(getErrorMessage(error)));
  }, []);

  if (selectedUser) {
    return (
      <div className="flex h-full min-h-0 flex-col rounded-xl bg-slate-100 p-4 sm:p-6">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">Team member reports</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-800">{selectedUser.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{selectedUser.email}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedUser(null)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-cyan-400 hover:text-cyan-700"
          >
            Back to team members
          </button>
        </header>

        <div className="min-h-0 flex-1 pt-5 ">
          <AllReports key={selectedUser.id} teamMemberId={selectedUser.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl bg-slate-100 p-4 sm:p-6">
      <header className="shrink-0 border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">People</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-800">Team members</h2>
        <p className="mt-1 text-sm text-slate-500">Open a member to review their reports.</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pt-5 scrollbar-hide">
        {errorMessage && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}
        {!errorMessage && users.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-500">No team members found.</div>}
        <div className="grid gap-4 lg:grid-cols-2">{users.map((user) => <UserCard key={user.id} user={user} onClick={() => setSelectedUser(user)} />)}</div>
      </div>

    </div>
  );
}