import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="flex justify-center items-center py-8"
      aria-label="Loading"
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
    >
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </motion.div>
  );
}