import { useSubmit } from "react-router-dom";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../store/auth-context";
import { toast } from "sonner";

const Modal = forwardRef(function Modal({ children, isLogout, url }, ref) {
  const { logout } = useAuth();
  const submit = useSubmit();

  function handleConfirm() {
    if (isLogout) {
      logout();
    }
    submit(null, { method: "POST", action: url });
    ref.current.close();
    toast.warning("You logged out successfuly.");
  }

  return createPortal(
    <dialog
      ref={ref}
      className="max-w-2xl flex-col items-center justify-center px-12 py-8 text-center backdrop-opacity-100"
    >
      <span className="text-7xl text-red-600">
        <ion-icon name="close-circle-outline" />
      </span>
      <h2 className="text-primary mb-6 text-4xl">Are you sure?</h2>
      <p className="mb-6">{children}</p>
      <div className="flex justify-end gap-3">
        <form method="dialog">
          <button className="bg-light cursor-pointer rounded-lg px-3 py-1">
            Cancel
          </button>
        </form>
        <button
          className="text-light cursor-pointer rounded-lg bg-red-600 px-3 py-1"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default Modal;