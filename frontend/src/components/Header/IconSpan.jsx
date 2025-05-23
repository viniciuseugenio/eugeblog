import { motion } from "motion/react";

export default function IconSpan({ children, isOpen, className }) {
  return (
    <motion.span
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className={`${className} flex items-center justify-center`}
    >
      {children}
    </motion.span>
  );
}
