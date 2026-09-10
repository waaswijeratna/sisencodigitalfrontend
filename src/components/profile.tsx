import { useRef } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "@animateicons/react/lucide";
import type { LogOutIconHandle } from "@animateicons/react/lucide";

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const logoutIconRef = useRef<LogOutIconHandle>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="text-xs">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-zinc-600 bg-zinc-900 text-xs font-medium text-white uppercase">
          {getInitials(user?.name)}
        </div>

        <div className="w-full overflow-hidden">
          <h1 className="truncate font-bold">{user?.name}</h1>
          <p className="truncate text-gray-500">{user?.email}</p>
        </div>
      </div>

      <button
        onClick={() => void handleLogout()}
        onMouseEnter={() => logoutIconRef.current?.startAnimation()}
        onMouseLeave={() => logoutIconRef.current?.stopAnimation()}
        className="cursor-pointer mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-500"
      >
        <span>Log out</span>
        <LogOutIcon ref={logoutIconRef} size={16} />
      </button>
    </div>
  );
}