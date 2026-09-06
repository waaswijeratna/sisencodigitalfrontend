import AuthForm from "../components/AuthForm";
import { login } from "../services/authService";
import type { LoginForm } from "../types/auth";

export default function Login() {
  const handleLogin = async (data: LoginForm) => {
    try {
      const response = await login(data);
      console.log(response.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <h1 className="mb-6 text-3xl font-bold">
        Login
      </h1>

      <AuthForm onSubmit={handleLogin} />
    </div>
  );
}