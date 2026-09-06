import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  AuthBootstrap,
  PublicOnlyRoute,
  ProtectedRoute,
  RoleRoute,
} from "./components/RouteGuards";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminHome from "./pages/admin/AdminHome";
import TeamMemberHome from "./pages/team-member/TeamMemberHome";
import { useAuthStore } from "./stores/authStore";
import { getRolePath } from "./types/auth";

function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap />
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<AuthPage><Login /></AuthPage>} />
          <Route path="/signup" element={<AuthPage><Signup /></AuthPage>} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RoleRedirect />} />
          <Route element={<RoleRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminHome />} />
          </Route>
          <Route element={<RoleRoute role="TEAM_MEMBER" />}>
            <Route path="/team-member" element={<TeamMemberHome />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AuthPage({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-16 text-[#20382e]">
      <div className="mx-auto mb-16 max-w-5xl text-sm font-semibold tracking-[0.16em] text-[#20382e]">
        SISENCO<span className="text-[#d36b42]">DIGITAL</span>
      </div>
      {children}
    </main>
  );
}

function RoleRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={user ? getRolePath(user.role) : "/login"} replace />;
}

export default App;