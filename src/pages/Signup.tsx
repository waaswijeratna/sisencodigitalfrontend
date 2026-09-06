import AuthForm from "../components/AuthForm";
import { signup } from "../services/authService";
import type { LoginForm, SignupForm } from "../types/auth";

export default function Signup() {
  const handleSignup = async (data: LoginForm | SignupForm) => {
    if (!("name" in data)) return;

    try {
      const response = await signup(data);
      console.log(response.user);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <h1 className="mb-6 text-3xl font-bold">
        Create Account
      </h1>

      <AuthForm
        isSignup
        onSubmit={handleSignup}
      />
    </div>
  );
}