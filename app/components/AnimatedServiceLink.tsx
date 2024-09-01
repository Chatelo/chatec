import React from "react";
import Link from "next/link";

type AnimatedLinkProps = {
  href: string;
  title: string;
  slug: string;
};

const AnimatedLink = ({ href, title, slug }: AnimatedLinkProps) => {
  return (
    <Link
      href={`/services/${slug}`}
      className="group relative inline-block text-xl text-blue-700 outline-none transition-all duration-300 ease-in-out"
    >
      <span className="relative z-10">
        Explore more on <span className="font-semibold">{title}</span> and
        processes
      </span>
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-700 transition-all duration-300 ease-in-out group-hover:w-full"></span>
    </Link>
  );
};

export default AnimatedLink;
