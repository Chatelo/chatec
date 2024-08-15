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
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-blue-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-blue-400">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-blue-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-blue-400">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Add social media icons/links here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
