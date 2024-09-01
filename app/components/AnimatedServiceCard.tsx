"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AnimatedLink from "./AnimatedServiceLink";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
  slug: string;
}

export default function AnimatedServiceCard({
  title,
  description,
  icon,
  slug,
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
      <Link href={`/services/${slug}`}>
        <h2 className="text-2xl font-bold mb-2 hover:text-blue-500 transition duration-300">
          {title}
        </h2>
      </Link>
      <p>
        {description}
        <AnimatedLink href={`/services/${slug}`} title={title} slug={slug} />
      </p>
    </motion.div>
  );
}
