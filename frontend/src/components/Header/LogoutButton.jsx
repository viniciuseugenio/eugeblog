import { useRef } from "react";
import Modal from "../Modal";
import IconSpan from "./IconSpan";

export default function LogoutButton() {
  const modal = useRef();

  function handleLogout(event) {
    event.preventDefault();
    modal.current.showModal();
  }

  return (
    <>
      <Modal ref={modal} isLogout title="Do you want to logout?">
        You will not be able to modify your posts nor view your bookmarks. You
        will have to login again.
      </Modal>
      <form className="h-full" onSubmit={handleLogout}>
        <button className="flex h-full items-center justify-center gap-2 py-2">
          <IconSpan>
            <ion-icon name="exit-outline"></ion-icon>
          </IconSpan>
          <span>Logout</span>
        </button>
      </form>
    </>
  );
}
