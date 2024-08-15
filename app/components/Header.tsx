"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className="bg-white shadow-md fixed top-0 left-0 right-0 z-10"
      role="banner"
    >
      <nav className="container mx-auto px-6 py-3" aria-label="Main Navigation">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold"
            aria-label="DevCompany Home"
          >
            Chatec Technologies
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-blue-500" aria-current="page">
              Home
            </Link>
            <Link href="/services" className="hover:text-blue-500">
              Services
            </Link>
            <Link href="/blog" className="hover:text-blue-500">
              Blog
            </Link>
            <Link href="/pricing" className="hover:text-blue-500">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-blue-500">
              Contact
            </Link>
          </div>
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Link href="/" className="block py-2 hover:text-blue-500">
              Home
            </Link>
            <Link href="/services" className="block py-2 hover:text-blue-500">
              Services
            </Link>
            <Link href="/blog" className="block py-2 hover:text-blue-500">
              Blog
            </Link>
            <Link href="/pricing" className="block py-2 hover:text-blue-500">
              Pricing
            </Link>
            <Link href="/contact" className="block py-2 hover:text-blue-500">
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
