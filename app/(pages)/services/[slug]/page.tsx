import { notFound } from "next/navigation";
import { services } from "@/app/data/servicesList";
import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/app/components/WhatsappButton";

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServicePage({ params }: { params: any }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">{service.title}</h1>
      <Image
        src={service.icon}
        alt={service.title}
        width={1000}
        height={400}
        className=" mb-8"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="
      />
      {/* <p className="text-xl mb-12">{service.description}</p> */}

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <ul className="list-disc pl-6">
          {service.keyFeatures?.map((feature, index) => (
            <li key={index} className="text-lg mb-2">
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.process?.map((step) => (
            <div key={step.step} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">
                Step {step.step}: {step.title}
              </h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-blue-800 text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">
          Let&apos;s bring your vision to life with our {service.title}{" "}
          expertise.
        </p>
        <div className="flex items-center justify-center gap-10">
          <WhatsAppButton />
          <Link
            href="/contact"
            className="bg-white text-blue-500 px-6 py-3 rounded-lg font-bold hover:bg-blue-100 transition duration-300"
          >
            Contact Us Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata({ params }: { params: any }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | Sigira Technologies`,
    description: service.description,
  };
}
