import Link from "next/link";

import StructuredData from "./components/StructuredData";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Chatec Technologies",
    url: "https://www.chatec.tech",
    logo: "https://www.chatec.tech/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254729057932",
      contactType: "customer service",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />

      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in">
          Building the Future of Web and Mobile
        </h1>
        <p className="text-xl mb-12 animate-fade-in-delay">
          We create cutting-edge applications that drive business growth and
          user engagement as well personal blogs.
        </p>
        <Link
          href="/pricing"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 animate-fade-in-delay-2"
        >
          Get Started
        </Link>
      </div>
    </>
  );
}
