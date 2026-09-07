import AuthForm from "../components/AuthForm";
import { signup } from "../services/authService";
import type { LoginForm, SignupForm } from "../types/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import KineticGrid from "../components/GridBg";

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
    <div className="flex min-h-screen w-full items-center gap-10 ">
      {/* Left side — kinetic grid with brand name */}
      <div className="hidden h-[95vh] w-1/2 md:block">
        <KineticGrid className="rounded-lg">
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl font-semibold tracking-tight text-white">
              SISENCO<span className="text-cyan-400">REPORTS</span>
            </span>
          </div>
        </KineticGrid>
      </div>

      {/* Right side — auth form */}
      <div className="mx-auto w-full max-w-md md:mx-0 md:w-1/2">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#d36b42]">
          Get started
        </p>
        <h1 className="mb-2 text-4xl font-semibold tracking-tight text-[#20382e]">
          Create your account
        </h1>
        <p className="mb-8 text-[#657066]">Join your team in a few seconds.</p>

        <AuthForm error={error} isSignup onSubmit={handleSignup} />
      </div>
    </div>
  );
}