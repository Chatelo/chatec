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
        "bg-gray-800 text-white w-full",
        isFixed ? "fixed bottom-0 left-0 right-0 md:fixed" : "",
        "md:static" // This ensures the footer is static on mobile
      )}
    >
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2">
              Quick Links
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm md:text-base hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm md:text-base hover:text-blue-400"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm md:text-base hover:text-blue-400"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-2">More</h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm md:text-base hover:text-blue-400"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm md:text-base hover:text-blue-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base md:text-lg font-semibold mb-2">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {/* Add social media icons/links here */}
              <a href="#" className="text-sm md:text-base hover:text-blue-400">
                Facebook
              </a>
              <a href="#" className="text-sm md:text-base hover:text-blue-400">
                Twitter
              </a>
              <a href="#" className="text-sm md:text-base hover:text-blue-400">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
