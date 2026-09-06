import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function TeamMemberHome() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-8 text-[#20382e]">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => void handleLogout()} className="float-right rounded-full border border-[#c8d0c7] px-4 py-2 text-sm font-semibold hover:bg-white">
          Log out
        </button>
        <p className="pt-12 text-sm font-semibold uppercase tracking-[0.2em] text-[#d36b42]">Team workspace</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">Good to see you, {user?.name}.</h1>
        <p className="mt-4 text-lg text-[#657066]">Your team space is ready.</p>
      </div>
    </main>
  );
}