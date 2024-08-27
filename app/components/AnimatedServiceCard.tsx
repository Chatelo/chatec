"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
}

export default function AnimatedServiceCard({
  title,
  description,
  icon,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-skin-fill text-skin-base p-6 rounded-lg shadow-md"
    >
      {icon && (
        <div className="mb-4">
          <Image src={icon} alt={title} width={600} height={100} />
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p>{description}</p>
    </motion.div>
  );
}
