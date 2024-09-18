import Link from "next/link";

import StructuredData from "./components/StructuredData";
import AnimatedServiceCard from "./components/AnimatedServiceCard";
import { services } from "@/app/data/servicesList";
import NewsletterSubscription from "./components/NewsletterSubscription";
// Home page
export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sigira Technologies",
    url: "https://www.sigira.com",
    logo: "https://www.sigira.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "254729830969",
      contactType: "customer service",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />

      <div className="container mx-auto px-6 py-16">
        <div className=" px-12 pb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in pt-12">
            Building the Future of Web and Mobile
          </h1>
          <p className="text-xl mb-12 animate-fade-in-delay">
            We create cutting-edge applications that drive business growth and
            user engagement as well personal blogs.
          </p>
          <Link
            href="/pricing"
            className="bg-blue-500 text-white px-6 py-3 te rounded-lg hover:bg-blue-600 transition duration-300 animate-fade-in-delay-2"
          >
            Get Started
          </Link>
        </div>
        <div className="pt-6">
          <h2 className="text-4xl font-bold text-center mb-6">
            Services we offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <AnimatedServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                slug={service.slug}
              />
            ))}
          </div>
        </div>
        <NewsletterSubscription />
      </div>
    </>
  );
}
