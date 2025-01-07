import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { useSubmit } from "react-router";
import { toast } from "sonner";
import { useLogout } from "../utils/hooks";

/**
 * Modal component that renders a dialog to confirm an important action. Portal is used to render the dialog in the root element.
 *
 * @param {React.ReactNode} props.children - The explanation text to be displayed inside the modal.
 * @param {string} props.title - The title of the modal.
 * @param {function} props.mutateFn - The function to be called when the confirm button is clicked.
 * @param {string} [props.icon="close-circle-outline"] - The name of the icon to be displayed in the modal.
 * @param {string} props.iconColor - The color class for the icon.
 * @param {string} props.confirmBtnClasses - The CSS classes for the confirm button. You must pass on the bg-color and text-color.
 * @param {React.Ref} ref - The reference to the dialog element.
 *
 * @returns {React.ReactPortal} A React Portal containing the modal dialog.
 */
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
