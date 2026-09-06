import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { getRolePath, type UserRole } from "../types/auth";

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1ea] text-sm text-[#5d665c]">
      Checking your session...
    </main>
  );
}

export function AuthBootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return null;
}

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const location = useLocation();

  if (!isInitialized) return <LoadingScreen />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) return <LoadingScreen />;
  if (user) return <Navigate to={getRolePath(user.role)} replace />;

  return <Outlet />;
}

export function RoleRoute({ role }: { role: UserRole }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={getRolePath(user.role)} replace />;

  return <Outlet />;
}

