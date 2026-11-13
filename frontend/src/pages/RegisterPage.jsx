import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "../layouts/AuthLayout";
import RegisterForm from "../features/auth/RegisterForm";

function RegisterPage() {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/browse" replace />;
  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Start tracking anime today.">
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-stone-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-orange-400 hover:underline">
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
