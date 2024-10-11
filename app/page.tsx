import StructuredData from "./components/StructuredData";
import AnimatedServiceCard from "./components/AnimatedServiceCard";
import { services } from "@/app/data/servicesList";
import NewsletterSubscription from "./components/NewsletterSubscription";
import HeroBanner from "./components/HeroBanner";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sigira Technologies",
    url: "https://www.sigira.com",
    logo: "https://www.sigira.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+254729830969",
      contactType: "customer service",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />

      <div className="w-full">
        <section className="w-full bg-gray-100 mt-8">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <HeroBanner />
          </div>
        </section>

        <section className="w-full mt-4">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">
              Services we offer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
        </section>

        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <NewsletterSubscription />
          </div>
        </section>
      </div>
    </>
  );
}
