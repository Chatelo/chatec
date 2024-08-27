import Link from "next/link";

import StructuredData from "./components/StructuredData";
import AnimatedServiceCard from "./components/AnimatedServiceCard";

export default function Home() {
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
      title: "SEO",
      description: `Boost Your Online Visibility: Dominate Search Results!We turn your website into a magnet for potential customers. Our cutting-edge SEO strategies propel your business to the top of search rankings, driving targeted traffic and supercharging your online presence. Don't just exist online - thrive and outshine your competition! Key features:
Custom-tailored SEO plans
Keyword domination
Content optimization wizardry
Technical SEO mastery
Transparent reporting

Ready to skyrocket your online success? Let's optimize your path to the top!`,
      icon: "/seo.jpg",
    },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sigira Technologies",
    url: "https://www.sigira.com",
    logo: "https://www.sigira.com/logo.png",
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
        <h1 className="text-4xl md:text-6xl font-bold mb-8 animate-fade-in pt-12">
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
        <div className="pt-36">
          <h2 className="text-4xl font-bold mb-12">Services we offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <AnimatedServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
