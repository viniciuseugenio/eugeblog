import { LogOutIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useLogout } from "../../utils/hooks";
import Modal from "../Modal";
import IconSpan from "./IconSpan";

export default function LogoutButton() {
  const { mutate } = useLogout();
  const [isOpen, setIsOpen] = useState();

  function handleLogout(event) {
    event.preventDefault();
    setIsOpen(true);
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal
            mutateFn={mutate}
            title="Are you sure you want to logout?"
            setIsOpen={setIsOpen}
          >
            You will not be able to modify your posts nor view your bookmarks.
            You will have to login again.
          </Modal>
        )}
      </AnimatePresence>

      <form onSubmit={handleLogout}>
        <button className="active:bg-accent flex items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-base duration-300 hover:bg-[#e2d3ca] hover:text-black">
          <IconSpan>
            <LogOutIcon size={15} />
          </IconSpan>
          <span className="font-medium">Logout</span>
        </button>
      </form>
    </>
  );
}
