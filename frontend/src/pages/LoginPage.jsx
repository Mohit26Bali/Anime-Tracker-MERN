import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "../layouts/AuthLayout";
import LoginForm from "../features/auth/LoginForm";

function LoginPage() {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Continue your anime journey.">
      <LoginForm />
      <p className="mt-6 text-center text-sm text-stone-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-orange-400 hover:underline">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
