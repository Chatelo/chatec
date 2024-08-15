import AnimatedServiceCard from "@/app/components/AnimatedServiceCard";

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
    <div className="container mx-auto px-6 py-16">
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
