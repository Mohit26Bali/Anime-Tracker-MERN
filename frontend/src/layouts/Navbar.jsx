import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import logo from "../assets/img.png";

const navLinkClass = ({ isActive }) =>
  `text-sm transition-colors ${isActive ? "font-semibold text-orange-400" : "text-stone-300 hover:text-white"}`;

function Navbar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-800 bg-stone-950/80 px-6 py-3 text-white backdrop-blur">
      <div className="flex items-center gap-6">
        <Link to={user ? "/browse" : "/"} className="flex items-center">
          <img src={logo} alt="Anime Tracker" className="h-14 w-auto" />
        </Link>
        <NavLink to="/search" className={navLinkClass}>
          Search
        </NavLink>
        {user && (
          <NavLink to="/browse" className={navLinkClass}>
            Browse
          </NavLink>
        )}
      </div>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Link to="/login" className="text-sm text-stone-300 transition-colors hover:text-white">
          Log in
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
