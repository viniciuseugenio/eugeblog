import { Link } from "react-router";
import IconHorizontal from "../../assets/eugeblog-hori.svg";
import SearchInput from "./SearchInput";
import { useAuthContext } from "../../store/auth-context";
import AuthHeader from "./AuthHeader";
import LoggedHeader from "./LoggedHeader";

export default function MainHeader() {
  const { isLogged } = useAuthContext();

  return (
    <>
      <header className="bg-light flex items-center justify-between px-14 py-4">
        <Link to="/" className="flex items-center">
          <img src={IconHorizontal} alt="" className="w-32" />
        </Link>

        <nav className="flex items-center justify-center">
          <SearchInput />
          <ul className={`${isLogged ? "gap-2" : "gap-6"} flex justify-center`}>
            {!isLogged ? <AuthHeader /> : <LoggedHeader />}
          </ul>
        </nav>
      </header>
    </>
  );
}
