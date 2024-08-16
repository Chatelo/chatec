"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";

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

    return () => {
      window.removeEventListener("resize", checkFooterPosition);
    };
  }, []);

  return (
    <footer
      className={clsx(
        "bg-gray-800 text-white w-full fixed bottom-0 left-0 right-0",
        isFixed ? "md:fixed md:bottom-0 md:left-0 md:right-0" : "md:static"
      )}
    >
      <div className="container mx-auto px-4 py-2 md:px-6 md:py-10">
        <div className="md:hidden">
          {/* Mobile footer content */}
          <div className="flex justify-between items-center">
            <Link href="/" className="text-sm hover:text-blue-400">
              Home
            </Link>
            <Link href="/services" className="text-sm hover:text-blue-400">
              Services
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
                  <Link
                    href="/services"
                    className="text-base hover:text-blue-400"
                  >
                    Services
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
                <a href="#" className="text-base hover:text-blue-400">
                  Facebook
                </a>
                <a href="#" className="text-base hover:text-blue-400">
                  Twitter
                </a>
                <a href="#" className="text-base hover:text-blue-400">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
