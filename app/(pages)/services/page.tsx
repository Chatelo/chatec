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
      description: `Code Your Success: Websites That Work Wonders
We craft stunning, high-performance websites that captivate your audience and drive results. From sleek corporate sites to complex e-commerce platforms, our expert developers turn your digital dreams into reality. Experience the perfect blend of aesthetics and functionality that keeps visitors coming back for more.`,
      icon: "/web.jpg",
    },
    {
      title: "Mobile App Development",
      description: `Apps That Make Waves: Your Idea, Our Innovation!
Transform your concept into a cutting-edge mobile app that users can't put down. Our skilled developers create intuitive, feature-rich applications for iOS and Android that stand out in the crowded app marketplace. Whether you're streamlining business operations or launching the next big thing, we've got the expertise to make it happen.`,
      icon: "/mobile.jpg",
    },
    {
      title: "UI/UX Design",
      description: `Design That Delights: Where Form Meets Function!
We create user interfaces that don't just look good – they feel right. Our UI/UX wizards craft seamless, intuitive experiences that keep users engaged and coming back for more. From wireframes to polished products, we ensure every click, swipe, and tap is a pleasure for your audience.`,
      icon: "/uiux.jpg",
    },
    {
      title: "Cloud Solutions",
      description:
        "Scalable and secure cloud infrastructure for your applications.",
      icon: "/cloud.jpg",
    },
    {
      title: "SEO",
      description:
        "Boost Your Online Visibility: Dominate Search Results!We turn your website into a magnet for potential customers. Our cutting-edge SEO strategies propel your business to the top of search rankings, driving targeted traffic and supercharging your online presence. Don't just exist online - thrive and outshine your competition! Key features: Custom-tailored SEO plans Keyword domination Content optimization wizardry Technical SEO mastery Transparent reporting Ready to skyrocket your online success? Let's optimize your path to the top!",
      icon: "/seo.jpg",
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
            icon={service.icon}
            description={service.description}
          />
        ))}
      </div>
    </div>
  );
}
