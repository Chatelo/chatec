import AnimatedServiceCard from "@/app/components/AnimatedServiceCard";
import { Metadata } from "next";
import { services } from "@/app/data/servicesList";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our range of services including web development, mobile app development, UI/UX design, and cloud solutions.",
  openGraph: {
    title: "Services",
    description:
      "Explore our range of services including web development, mobile app development, UI/UX design, and cloud solutions.",
    url: "https://sigira.com/services",
    type: "website",
    images: [
      {
        url: "https://sigira.com/android-192x192.png",
        width: 1200,
        height: 630,
        alt: "Sigira Technologies Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services",
    description:
      "Explore our range of services including web development, mobile app development, UI/UX design, and cloud solutions.",
    images: ["https://sigira.com/sigira-og.png"],
  },
};

export default function Services() {
  return (
    <div className="container text-skin-base bg-skin-fill mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <AnimatedServiceCard
            key={index}
            title={service.title}
            icon={service.icon}
            slug={service.slug}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
}
