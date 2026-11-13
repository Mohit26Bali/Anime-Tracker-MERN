import { useState } from "react";
import { useSelector } from "react-redux";
import { changePassword } from "../../services/authApi";
import { apiErrorMessage } from "../../utils/apiError";
import usePasswordStrength from "../../hooks/usePasswordStrength";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { EyeIcon, EyeOffIcon, SpinnerIcon } from "../../components/icons";

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 pr-9 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40";

function ChangePasswordForm() {
  const user = useSelector((state) => state.auth.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const strength = usePasswordStrength(newPassword, { username: user?.username, email: user?.email });
  const sameAsCurrent = newPassword.length > 0 && newPassword === currentPassword;
  const rejected = (strength !== null && !strength.ok) || sameAsCurrent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rejected) return;
    setStatus("loading");
    setError(null);
    setSuccess(null);
    try {
      const data = await changePassword({ currentPassword, newPassword });
      setSuccess(data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not change password"));
    } finally {
      setStatus("idle");
    }
  };

  const toggle = (
    <button
      type="button"
      onClick={() => setShowPasswords((v) => !v)}
      aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
    >
      {showPasswords ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
    </button>
  );

  return (
    <section className="mt-10 border-t border-stone-800 pt-8">
      <h2 className="text-xl font-bold">Change Password</h2>
      <p className="mt-1 text-sm text-stone-400">Changing your password signs you out on all other devices.</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Helps password managers associate the change with this account. */}
        <input type="text" name="username" autoComplete="username" value={user?.username ?? ""} readOnly hidden />

        <div>
          <label htmlFor="current-password" className="mb-1 block text-xs font-medium text-stone-400">
            Current password
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
            />
            {toggle}
          </div>
        </div>

        <div>
          <label htmlFor="new-password" className="mb-1 block text-xs font-medium text-stone-400">
            New password
          </label>
          <input
            id="new-password"
            type={showPasswords ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className={inputClass}
          />
          <PasswordStrengthMeter strength={strength} hasPassword={newPassword.length > 0} />
          {sameAsCurrent && <p className="mt-1 text-xs text-red-400">New password must be different from the current one.</p>}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="text-sm text-green-400">
            ✓ {success}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || rejected}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
        >
          {status === "loading" && <SpinnerIcon className="h-4 w-4" />}
          {status === "loading" ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}

export default ChangePasswordForm;
