import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

function UserMenu({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm text-stone-200 hover:bg-stone-800"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.username} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs font-semibold text-white">
            {user.username.charAt(0).toUpperCase()}
          </span>
        )}
        {user.username}
        <span className="text-stone-500">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-stone-700 bg-stone-800 py-1 shadow-xl">
          <Link
            to="/watchlist"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-stone-200 hover:bg-stone-700"
          >
            My Watchlist
          </Link>
          <Link
            to="/favorites"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-stone-200 hover:bg-stone-700"
          >
            My Favorites
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-stone-200 hover:bg-stone-700"
          >
            Edit Profile
          </Link>
          <div className="my-1 border-t border-stone-700" />
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-stone-700"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
