"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
}

export default function AnimatedServiceCard({
  title,
  description,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p>{description}</p>
    </motion.div>
  );
}
