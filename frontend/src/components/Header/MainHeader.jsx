import { useRef } from "react";
import { Link } from "react-router";
import IconHorizontal from "../../assets/eugeblog-hori.svg";
import { useAuth } from "../../store/auth-context";
import Modal from "../Modal";
import AuthHeader from "./AuthHeader";
import LoggedHeader from "./LoggedHeader";

export default function MainHeader() {
  const modal = useRef();
  const { isLogged } = useAuth();

  function handleLogout(event) {
    event.preventDefault();
    modal.current.showModal();
  }

  return (
    <>
      <Modal ref={modal} isLogout title="Do you want to logout?" url="/logout">
        You will not be able to modify your posts nor view your bookmarks. You
        will have to login again.
      </Modal>

      <header className="flex justify-between bg-[#E4E0E1] px-14 py-4">
        <Link to="/" className="flex items-center">
          <img src={IconHorizontal} alt="" className="w-32" />
        </Link>
        <nav className="flex items-center justify-center">
          <ul className={`${isLogged ? "gap-2" : "gap-6"} flex justify-center`}>
            {!isLogged ? (
              <AuthHeader />
            ) : (
              <LoggedHeader handleLogout={handleLogout} />
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}
