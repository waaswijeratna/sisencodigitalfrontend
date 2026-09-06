import AuthForm from "../components/AuthForm";
import { useAuthStore } from "../stores/authStore";
import { getRolePath, type LoginForm } from "../types/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | undefined>();
  const successMessage = location.state?.message as string | undefined;

  const handleLogin = async (data: LoginForm) => {
    setError(undefined);
    try {
      const user = await login(data);
      const from = location.state?.from?.pathname;
      navigate(from ?? getRolePath(user.role), { replace: true });
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d36b42]">
        Welcome back
      </p>
      <h1 className="mb-2 text-4xl font-semibold tracking-tight text-[#20382e]">
        Log in to your workspace
      </h1>
      <p className="mb-8 text-[#657066]">Pick up where you left off.</p>

      {successMessage && (
        <p className="mb-5 rounded-lg border border-[#b9d7c8] bg-[#edf8f1] px-4 py-3 text-sm text-[#236342]">
          {successMessage}
        </p>
      )}

      <AuthForm error={error} onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  );
}