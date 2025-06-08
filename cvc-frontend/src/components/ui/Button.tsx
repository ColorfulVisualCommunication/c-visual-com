import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: "primary" | "danger" | "warning" | "secondary";
  children: React.ReactNode;
};

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2",
        {
          "bg-primary text-white hover:bg-blue-400": variant === "primary",
          "bg-danger text-white hover:bg-pink-500": variant === "danger",
          "bg-warning text-black hover:bg-yellow-400": variant === "warning",
          "bg-gray-700 text-white hover:bg-gray-600": variant === "secondary",
        },
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
