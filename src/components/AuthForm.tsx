import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { EyeIcon, EyeClosedIcon } from "@animateicons/react/lucide";
import type { LoginForm, SignupForm } from "../types/auth";

interface AuthFormProps {
  error?: string;
  isSignup?: boolean;
  isLoading?: boolean;
  onSubmit: (data: LoginForm | SignupForm) => void | Promise<void>;
}

export default function AuthForm({
  error,
  isSignup = false,
  isLoading = false,
  onSubmit,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm & Partial<SignupForm>>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {isSignup && (
        <div>
          <label className="mb-2 block text-sm font-medium">Name</label>

          <input
            {...register("name", {
              required: "Username is required",
            })}
            className="w-full rounded-lg border p-3"
            placeholder="John"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>

        <input
          type="email"
          {...register("email", {
            required: "Email is required",
          })}
          className="w-full rounded-lg border p-3"
          placeholder="john@example.com"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full rounded-lg border p-3 pr-10"
            placeholder="••••••••"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-zinc-500 hover:text-zinc-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeIcon size={20} duration={1} color="#666666" />
            ) : (
              <EyeClosedIcon size={20} duration={1} color="#666666" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer rounded-lg bg-zinc-800 py-3 font-semibold text-white"
      >
        {isLoading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
      </button>

      <p className="text-center text-sm text-[#657066]">
        {isSignup ? "Already have an account?" : "New to SisencoReports?"}{" "}
        <Link
          to={isSignup ? "/login" : "/signup"}
          className="font-semibold text-[#1f5b4c] hover:text-[#163f35]"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}