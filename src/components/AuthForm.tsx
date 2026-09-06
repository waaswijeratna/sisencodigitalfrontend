import { useForm } from "react-hook-form";
import type { LoginForm, SignupForm } from "../types/auth";

interface AuthFormProps {
  isSignup?: boolean;
  onSubmit: (data: LoginForm | SignupForm) => void;
}

export default function AuthForm({
  isSignup = false,
  onSubmit,
}: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm & Partial<SignupForm>>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {isSignup && (
        <div>

          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

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
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

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
        <label className="mb-2 block text-sm font-medium">
          Password
        </label>

        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full rounded-lg border p-3"
          placeholder="••••••••"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white"
      >
        {isSignup ? "Create Account" : "Login"}
      </button>
    </form>
  );
}