import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { SpinnerIcon } from "./icons";

function ProtectedRoute() {
  const { user, status } = useSelector((state) => state.auth);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-white">
        <SpinnerIcon className="h-6 w-6 text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
