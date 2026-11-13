import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../features/auth/authSlice";
import ChangePasswordForm from "../features/auth/ChangePasswordForm";

function ProfilePage() {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState(user?.username ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [status, setStatus] = useState("idle");
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setSaved(false);
    const result = await dispatch(updateProfile({ username, avatar }));
    setStatus("idle");
    if (updateProfile.fulfilled.match(result)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-stone-950 px-6 py-12 text-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="mt-1 text-sm text-stone-400">Update your username and avatar.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {avatar ? (
              <img src={avatar} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-xl font-semibold text-white">
                {username.charAt(0).toUpperCase() || "?"}
              </span>
            )}
            <div className="flex-1">
              <label htmlFor="avatar" className="mb-1 block text-xs font-medium text-stone-400">
                Avatar URL
              </label>
              <input
                id="avatar"
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="mb-1 block text-xs font-medium text-stone-400">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
            />
          </div>

          <p className="text-sm text-stone-500">Email: {user?.email}</p>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {saved && <p className="text-sm text-green-400">✓ Profile updated</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 rounded-lg bg-orange-600 px-4 py-2.5 font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
          >
            {status === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <ChangePasswordForm />
      </div>
    </div>
  );
}

export default ProfilePage;
