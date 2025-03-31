import { Link } from "react-router";
import LoggedIcon from "../../assets/eu-icon.svg";
import NormalIcon from "../../assets/eugeblog-hori.svg";
import { useAuthContext } from "../../store/auth-context";
import AuthLinks from "./AuthLinks";
import UserDropdown from "./Dropdown/UserDropdown";
import LoggedHeader from "./LoggedHeader";
import SearchInput from "./SearchInput";

export default function MainHeader() {
  const { isLogged } = useAuthContext();

  const logoSrc = isLogged ? LoggedIcon : NormalIcon;
  const iconClasses = isLogged ? "w-14" : "w-32 py-2";

  return (
    <header className="bg-light flex items-center justify-between px-14 py-2">
      <div className="flex items-center justify-center gap-6">
        <Link to="/" className="flex items-center">
          <img src={logoSrc} alt="Site logo" className={iconClasses} />
        </Link>

        {isLogged && <LoggedHeader />}
      </div>

      <div className="flex items-center justify-center">
        <SearchInput />
        <>{!isLogged ? <AuthLinks /> : <UserDropdown />}</>
      </div>
    </header>
  );
}
