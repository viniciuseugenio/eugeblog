import { useRef } from "react";
import Modal from "../Modal";
import IconSpan from "./IconSpan";
import { useLogout } from "../../utils/hooks";

export default function LogoutButton() {
  const modal = useRef();
  const { mutate } = useLogout();

  function handleLogout(event) {
    event.preventDefault();
    modal.current.showModal();
  }

  return (
    <>
      <Modal
        ref={modal}
        mutateFn={mutate}
        title="Are you sure you want to logout?"
        iconColor="text-red-600"
        confirmBtnClasses="bg-red-200 text-red-950 ring-1 ring-red-300 hover:bg-red-300 hover:shadow-xl"
      >
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
