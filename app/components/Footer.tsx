"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";
import XIcon from "@heroicons/react/24/solid";

export default function Footer() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const checkFooterPosition = () => {
      if (typeof window !== "undefined") {
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.offsetHeight;
        const footerHeight =
          document.querySelector("footer")?.offsetHeight || 0;

        setIsFixed(windowHeight > bodyHeight - footerHeight);
      }
    };

    checkFooterPosition();
    window.addEventListener("resize", checkFooterPosition);
    window.addEventListener("scroll", checkFooterPosition);

    return () => {
      window.removeEventListener("resize", checkFooterPosition);
      window.removeEventListener("scroll", checkFooterPosition);
    };
  }, []);

  return (
    <footer
      className={clsx(
        "bg-gray-800 text-white w-full",
        isFixed ? "fixed bottom-0 left-0 right-0" : "relative"
      )}
    >
      <div className="container mx-auto px-4 py-2 md:px-6 md:py-10">
        <div className="md:hidden">
          {/* Mobile footer content */}
          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm hover:text-blue-400">
              Home
            </Link>
            <Link href="/blog" className="text-sm hover:text-blue-400">
              Blog
            </Link>
            <Link href="/contact" className="text-sm hover:text-blue-400">
              Contact
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          {/* Desktop footer content */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-base hover:text-blue-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-base hover:text-blue-400">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">More</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/pricing"
                    className="text-base hover:text-blue-400"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-base hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href="#"
                  className="text-base hover:text-blue-400 "
                >
                  Facebook
                </Link>
                <Link
                  href="https://x.com/@SigiraTech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-skin-fill text-skin-base hover:text-blue-400 inline-flex items-center rounded-full p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
