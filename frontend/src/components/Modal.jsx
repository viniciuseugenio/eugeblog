import { TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";

/**
 * Modal component that renders a dialog to confirm an important action. Portal is used to render the dialog in the root element.
 *
 * @param {React.ReactNode} props.children - The explanation text to be displayed inside the modal.
 * @param {string} props.title - The title of the modal.
 * @param {function} props.mutateFn - The function to be called when the confirm button is clicked.
 * @param {string} [props.icon="close-circle-outline"] - The name of the icon to be displayed in the modal.
 * @param {string} props.iconColor - The color class for the icon.
 * @param {string} props.confirmBtnClasses - The CSS classes for the confirm button. You must pass on the bg-color and text-color.
 * @param {function} props.setIsOpen - The function to close the modal.
 *
 * @returns {React.ReactPortal} A React Portal containing the modal dialog.
 */

export default function Modal({
  children,
  title,
  mutateFn,
  setIsOpen,
  Icon = TriangleAlert,
}) {
  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black bg-opacity-30"
        onClick={() => setIsOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.dialog
          open
          className="fixed z-50 max-w-2xl rounded-lg px-12 py-8 text-center shadow-md"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { type: "spring" },
          }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <span className="mb-6 flex w-full items-center  justify-center text-yellow-500">
            <Icon size={84} />
          </span>
          <h2 className="text-primary mb-6 text-4xl font-medium">{title}</h2>
          <p className="mb-6">{children}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg px-3 py-1 ring-1 ring-stone-300 duration-300 hover:bg-stone-200 hover:shadow-lg active:bg-stone-300"
            >
              Cancel
            </button>
            <button
              className="cursor-pointer rounded-lg bg-yellow-200 px-3 py-1 text-yellow-950 shadow-md ring-1 ring-yellow-300 duration-300 hover:bg-yellow-300 hover:shadow-lg active:bg-amber-400"
              onClick={mutateFn}
            >
              I am sure
            </button>
          </div>
        </motion.dialog>
      </motion.div>
    </>,
    document.getElementById("modal"),
  );
}
