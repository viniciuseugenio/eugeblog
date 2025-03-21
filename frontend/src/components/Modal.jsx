import { TriangleAlert, X } from "lucide-react";
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
  title,
  description,
  onConfirm,
  confirmText,
  cancelText,
  onCancel,
  Icon = TriangleAlert,
  variant = "danger",
}) {
  const colorVariants = {
    danger: {
      button: "bg-red-500 hover:bg-red-600 active:bg-red-700",
      icon: "bg-red-100 text-red-600",
    },
    info: {
      button: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
      icon: "bg-blue-100 text-blue-600",
    },
    success: {
      button: "bg-green-500 hover:bg-green-600 active:bg-green-700",
      icon: "bg-green-100 text-green-600",
    },
  };

  return createPortal(
    <>
      {/* Backdrop  */}
      <motion.div
        className="fixed inset-0 z-40 bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Dialog */}
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.dialog
          open
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className="relative z-50 grid max-w-md auto-rows-auto grid-cols-[auto_1fr] gap-x-3 rounded-lg p-6 shadow-md"
          variants={{
            visible: {
              scale: 1,
              opacity: 1,
            },
            hidden: { scale: 0.95, opacity: 0 },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <button
            type="button"
            className="absolute right-3 top-3 opacity-60 duration-300 hover:opacity-80"
            onClick={onCancel}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <span
            className={`${colorVariants[variant].icon} row-span-3 self-start rounded-full p-2`}
          >
            <Icon />
          </span>

          <header>
            <h2 id="modal-title" className="mb-2 text-lg font-medium">
              {title}
            </h2>
          </header>

          <section id="modal-description">
            <p className="text-sm opacity-70">{description}</p>
          </section>

          <footer className="mt-6 flex justify-end gap-3 text-sm">
            <button
              onClick={onCancel}
              className="cursor-pointer rounded-md px-4 py-2 font-medium ring-1 ring-stone-300 duration-300 hover:bg-stone-200 active:bg-stone-300"
            >
              {cancelText}
            </button>

            <button
              className={`${colorVariants[variant].button} cursor-pointer rounded-md px-4 py-2 font-medium text-white duration-300`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </footer>
        </motion.dialog>
      </motion.div>
    </>,
    document.getElementById("modal"),
  );
}
