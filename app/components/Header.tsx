import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md" role="banner">
      <nav className="container mx-auto px-6 py-3" aria-label="Main Navigation">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold"
            aria-label="DevCompany Home"
          >
            Chatec Inc.
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
        </div>
      </nav>
    </header>
  );
}
