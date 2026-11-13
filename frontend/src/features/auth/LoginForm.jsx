import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./authSlice";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, SpinnerIcon } from "../../components/icons";

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-stone-800 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [justSucceeded, setJustSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      setJustSucceeded(true);
      setTimeout(() => navigate("/browse"), 600);
    }
  };

  if (justSucceeded) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="text-3xl">✓</span>
        <p className="font-semibold text-white">Welcome back!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="login-email" className="mb-1 block text-xs font-medium text-stone-400">
          Email
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="login-password" className="block text-xs font-medium text-stone-400">
            Password
          </label>
          <span className="text-xs text-stone-600" title="Coming soon">
            Forgot Password?
          </span>
        </div>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`${inputClass} pr-9`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2.5 font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
      >
        {status === "loading" && <SpinnerIcon className="h-4 w-4" />}
        {status === "loading" ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}

export default LoginForm;
