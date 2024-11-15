import { Link, useSubmit } from "react-router-dom";
import IconHorizontal from "../assets/eugeblog-hori.svg";
import { useAuth } from "../store/auth-context";

export default function MainHeader() {
  const { isLogged, logout } = useAuth();
  const submit = useSubmit();

  function handleLogout() {
    logout();
    submit(null, { method: "POST", action: "/logout" });
  }

  return (
    <header className="flex justify-between bg-[#E4E0E1] px-14 py-4">
      <Link to="/" className="flex items-center">
        <img src={IconHorizontal} alt="" className="w-32" />
      </Link>
      <nav>
        <ul className="flex h-12 items-center justify-center gap-6 ">
          {!isLogged && (
            <>
              <li>
                <Link
                  to="/signup"
                  className="font-medium duration-300 hover:text-[#5b4a3e]"
                >
                  Get started
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="rounded-lg bg-[#D6C0B3] px-4 py-2 font-medium duration-300 hover:text-[#5b4a3e] "
                >
                  Log in
                </Link>
              </li>
            </>
          )}
          {isLogged && (
            <li>
              <form onSubmit={handleLogout}>
                <button className="rounded-lg bg-[#D6C0B3] px-4 py-2 font-medium duration-300 hover:text-[#5b4a3e] ">
                  Logout
                </button>
              </form>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
