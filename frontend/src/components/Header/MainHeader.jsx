import { Link } from "react-router-dom";
import IconHorizontal from "../../assets/eugeblog-hori.svg";
import { useAuthContext } from "../../store/auth-context";
import AuthHeader from "./AuthHeader";
import LoggedHeader from "./LoggedHeader";

export default function MainHeader() {
  const { isLogged } = useAuthContext();

  return (
    <>
      <header className="flex justify-between bg-[#E4E0E1] px-14 py-4">
        <Link to="/" className="flex items-center">
          <img src={IconHorizontal} alt="" className="w-32" />
        </Link>
        <nav className="flex items-center justify-center">
          <ul className={`${isLogged ? "gap-2" : "gap-6"} flex justify-center`}>
            {!isLogged ? <AuthHeader /> : <LoggedHeader />}
          </ul>
        </nav>
      </header>
    </>
  );
}
