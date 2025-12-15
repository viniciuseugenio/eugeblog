import { Plus } from "lucide-react";
import { Link } from "react-router";
import LoggedIcon from "../../assets/eu-icon.svg";
import NormalIcon from "../../assets/eugeblog-hori.svg";
import { useAuthContext } from "../../store/auth-context";
import AuthLinks from "./AuthLinks";
import UserDropdown from "./Dropdown/UserDropdown";
import IconSpan from "./IconSpan";
import SearchInput from "./SearchInput";

export default function Navbar() {
  const { isAuthenticated } = useAuthContext();

  const logoSrc = isAuthenticated ? LoggedIcon : NormalIcon;
  const iconClasses = isAuthenticated ? "w-14" : "w-32 py-2";

  return (
    <nav className="bg-light flex items-center justify-between px-14 py-2">
      <div className="flex items-center justify-center gap-6">
        <Link to="/" className="flex items-center">
          <img src={logoSrc} alt="Site logo" className={iconClasses} />
        </Link>

        {isAuthenticated && (
          <ul className="flex gap-3">
            <Link
              to="/post/create/"
              className="active:bg-accent group relative flex items-center justify-center rounded-lg py-2 px-4 duration-300 hover:bg-[#e2d3ca] hover:text-black"
            >
              <li className="flex gap-2">
                <IconSpan>
                  <Plus size={20} />
                </IconSpan>
                <p className="text-sm">New post</p>
              </li>
            </Link>
          </ul>
        )}
      </div>

      <div className="flex items-center justify-center">
        <SearchInput />
        <>{!isAuthenticated ? <AuthLinks /> : <UserDropdown />}</>
      </div>
    </nav>
  );
}
