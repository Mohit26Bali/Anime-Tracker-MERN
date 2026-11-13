import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./authSlice";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, SpinnerIcon } from "../../components/icons";
import usePasswordStrength from "../../hooks/usePasswordStrength";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-stone-800 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40";

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [justSucceeded, setJustSucceeded] = useState(false);

  const strength = usePasswordStrength(password, { username, email });
  // Instant feedback only; the backend enforces the same policy on submit.
  const passwordRejected = strength !== null && !strength.ok;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRejected) return;
    const result = await dispatch(registerUser({ username, email, password }));
    if (registerUser.fulfilled.match(result)) {
      setJustSucceeded(true);
      setTimeout(() => navigate("/browse"), 600);
    }
  };

  if (justSucceeded) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="text-3xl">✓</span>
        <p className="font-semibold text-white">Account created!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="register-username" className="mb-1 block text-xs font-medium text-stone-400">
          Username
        </label>
        <input
          id="register-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1 block text-xs font-medium text-stone-400">
          Email
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            id="register-email"
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
        <label htmlFor="register-password" className="mb-1 block text-xs font-medium text-stone-400">
          Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
        <PasswordStrengthMeter strength={strength} hasPassword={password.length > 0} />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading" || passwordRejected}
        className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2.5 font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-50"
      >
        {status === "loading" && <SpinnerIcon className="h-4 w-4" />}
        {status === "loading" ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}

export default RegisterForm;
