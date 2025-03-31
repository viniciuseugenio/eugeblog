import { LogOutIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useLogout } from "../../utils/hooks";
import Modal from "../Modal";

export default function LogoutButton({ Icon }) {
  const { mutate } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Modal
            onConfirm={mutate}
            onCancel={() => setIsOpen(false)}
            title="Logout Confirmation"
            description="Are you sure you want to log out of your account?"
            confirmText="Logout"
            cancelText="Stay Logged In"
            variant="info"
            Icon={LogOutIcon}
          />
        )}
      </AnimatePresence>

      <li
        onClick={() => setIsOpen(true)}
        className="hover:bg-light/70 m-1 grid grid-cols-[1fr_auto] items-center gap-1 rounded-md px-2 py-1.5 text-red-500 duration-300 hover:text-red-600"
      >
        Log out
        <Icon className="h-4 w-4" />
      </li>
    </>
  );
}
