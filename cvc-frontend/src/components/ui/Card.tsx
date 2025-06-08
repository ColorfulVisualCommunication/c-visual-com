import { motion } from "framer-motion";

type CardProps = {
  title: string;
  description?: string;
  imageUrl?: string;
  children?: React.ReactNode;
};

export default function Card({ title, description, imageUrl, children }: CardProps) {
  return (
    <motion.div
      className="bg-brand-dark rounded-lg shadow-lg p-4 flex flex-col gap-2 hover:shadow-xl transition"
      whileHover={{ scale: 1.02 }}
    >
      {imageUrl && (
        <img src={imageUrl} alt={title} className="rounded mb-2 w-full object-cover h-48" />
      )}
      <h3 className="text-lg font-bold text-primary">{title}</h3>
      {description && <p className="text-gray-300">{description}</p>}
      {children}
    </motion.div>
  );
}