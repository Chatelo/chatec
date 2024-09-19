"use client";

import Link from "next/link";
import { useState, ReactNode, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import DarkModeToggle from "./DarkModeToggle";

// Helper function to get the first name
const getFirstName = (fullName: string | null | undefined): string => {
  if (!fullName) return "User";
  return fullName.split(" ")[0];
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const MenuLink = ({
    href,
    children,
    onClick,
  }: {
    href: string;
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      className="block py-2 px-4 text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
      onClick={() => {
        closeMenu();
        if (onClick) onClick();
      }}
    >
      {children}
    </Link>
  );

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

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
            Sigira Technologies
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
              href="/blog"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Blog
            </Link>
            {/* <Link
              href="/pricing"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Pricing
            </Link> */}
            <Link
              href="/contact"
              className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Contact
            </Link>
            {session ? (
              <>
                {/* TODO : to fix the error before pushing */}
                {session.user?.isAdmin && (
                  <Link
                    href="/admin/blog"
                    className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    Manage Posts
                  </Link>
                )}
                <span className="text-gray-800 dark:text-gray-200">
                  Hi,{" "}
                  {getFirstName(session.user?.name) ||
                    session.user?.email ||
                    "User"}
                </span>

                <button
                  onClick={handleSignOut}
                  className="text-red-400 hover:text-blue-500 dark:text-red-400 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="text-gray-800 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
            <DarkModeToggle />
          </div>
          <div className="md:hidden flex items-center">
            <DarkModeToggle />
            <button
              ref={buttonRef}
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
          ref={menuRef}
          className={`md:hidden mt-4 bg-white dark:bg-gray-800 absolute right-6 top-full w-48 shadow-lg rounded-lg transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <MenuLink href="/">Home</MenuLink>
          <MenuLink href="/blog">Blog</MenuLink>
          <MenuLink href="/pricing">Pricing</MenuLink>
          <MenuLink href="/contact">Contact</MenuLink>
          {session ? (
            <>
              {session.user?.isAdmin && (
                <MenuLink href="/admin/blog">Manage Posts</MenuLink>
              )}
              <MenuLink href="#" onClick={handleSignOut}>
                Sign Out
              </MenuLink>
              <div className="py-2 px-4 text-gray-800 dark:text-gray-200">
                Welcome,{" "}
                {getFirstName(session.user?.name) ||
                  session.user?.email ||
                  "User"}
              </div>
            </>
          ) : (
            <>
              <MenuLink href="/auth/signin">Sign In</MenuLink>
              <MenuLink href="/auth/register">Register</MenuLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
