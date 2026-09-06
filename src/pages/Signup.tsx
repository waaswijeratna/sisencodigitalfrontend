import AuthForm from "../components/AuthForm";
import { signup } from "../services/authService";
import type { LoginForm, SignupForm } from "../types/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();

  const handleSignup = async (data: LoginForm | SignupForm) => {
    if (!("name" in data)) return;

    setError(undefined);
    try {
      await signup(data);
      navigate("/login", {
        replace: true,
        state: { message: "Account created. Log in to continue." },
      });
    } catch {
      setError("That email is already registered or the request failed.");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d36b42]">
        Get started
      </p>
      <h1 className="mb-2 text-4xl font-semibold tracking-tight text-[#20382e]">
        Create your account
      </h1>
      <p className="mb-8 text-[#657066]">Join your team in a few seconds.</p>

      <AuthForm
        error={error}
        isSignup
        onSubmit={handleSignup}
      />
    </div>
  );
}