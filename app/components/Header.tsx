"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Toggling menu. Current state:", isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const MenuLink = ({
    href,
    children,
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <Link
      href={href}
      className="block py-2 px-4 text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
      onClick={closeMenu}
    >
      {children}
    </Link>
  );

  return (
    <header
      className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-10 transition-colors duration-200"
      role="banner"
    >
      <nav
        className="container mx-auto px-6 py-3 relative"
        aria-label="Main Navigation"
      >
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200"
            aria-label="DevCompany Home"
          >
            Chatec Technologies
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
              aria-current="page"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link
              href="/pricing"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Contact
            </Link>
            <DarkModeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <DarkModeToggle />
            <button
              className="ml-4 p-2 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
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
        </div>
        <div
          className={`md:hidden mt-4 bg-white dark:bg-gray-800 absolute right-6 top-full w-48 shadow-lg rounded-lg transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <MenuLink href="/">Home</MenuLink>
          <MenuLink href="/services">Services</MenuLink>
          <MenuLink href="/blog">Blog</MenuLink>
          <MenuLink href="/pricing">Pricing</MenuLink>
          <MenuLink href="/contact">Contact</MenuLink>
        </div>
      </nav>
    </header>
  );
}
