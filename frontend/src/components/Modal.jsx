import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { useSubmit } from "react-router";
import { toast } from "sonner";
import { useLogout } from "../utils/hooks";

const Modal = forwardRef(function Modal(
  {
    children,
    title,
    isLogout,
    url,
    icon = "close-circle-outline",
    iconColor = "bg-red-600",
  },
  ref,
) {
  const submit = useSubmit();
  const { mutate: logout } = useLogout();

  function handleConfirm() {
    let newUrl = url;

    if (isLogout) {
      logout();
      return;
    }

    submit(null, { method: "POST", action: newUrl });
    ref.current.close();
    toast.warning("You logged out successfuly.");
  }

  return createPortal(
    <dialog
      ref={ref}
      className="max-w-2xl flex-col items-center justify-center px-12 py-8 text-center backdrop-opacity-100"
    >
      <span className={`${iconColor} text-7xl`}>
        <ion-icon name={icon} />
      </span>
      <h2 className="text-primary mb-6 text-4xl">{title}</h2>
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
