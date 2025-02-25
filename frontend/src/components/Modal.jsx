import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { TriangleAlert } from "lucide-react";

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
  { children, title, mutateFn, Icon = TriangleAlert },
  ref,
) {
  return createPortal(
    <dialog ref={ref} className="max-w-2xl rounded-lg px-12 py-8 text-center">
      <span className="mb-6 flex w-full items-center  justify-center text-yellow-500">
        <Icon size={84} />
      </span>
      <h2 className="text-primary mb-6 text-4xl font-medium">{title}</h2>
      <p className="mb-6">{children}</p>
      <div className="flex justify-end gap-3">
        <form method="dialog">
          <button className="cursor-pointer rounded-lg px-3 py-1 ring-1 ring-stone-300 duration-300 hover:bg-stone-200 hover:shadow-lg active:bg-stone-300">
            Cancel
          </button>
        </form>
        <button
          className="cursor-pointer rounded-lg bg-yellow-200 px-3 py-1 text-yellow-950 shadow-md ring-1 ring-yellow-300 duration-300 hover:bg-yellow-300 hover:shadow-lg active:bg-amber-400"
          onClick={mutateFn}
        >
          I am sure
        </button>
      </div>
    </dialog>,
    document.getElementById("modal"),
  );
});

export default Modal;
