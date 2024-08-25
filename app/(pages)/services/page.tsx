import AnimatedServiceCard from "@/app/components/AnimatedServiceCard";
import { Metadata } from "next";

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
  const services = [
    {
      title: "Web Development",
      description: "Custom web applications tailored to your needs.",
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile apps for iOS and Android.",
    },
    {
      title: "UI/UX Design",
      description: "User-centric designs that enhance user experience.",
    },
    {
      title: "Cloud Solutions",
      description:
        "Scalable and secure cloud infrastructure for your applications.",
    },
  ];

  return (
    <div className="container text-skin-base bg-skin-fill mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <AnimatedServiceCard
            key={index}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
}
