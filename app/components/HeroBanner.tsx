"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const services = [
  "Mobile App Development",
  "Web App Development",
  "UI/UX Design",
  "Cloud Solutions",
  "E-commerce Development",
  "SEO Services",
  "AI Integration",
  "Social Media Integration",
  "Payment Gateway/MPESA Integration",
  "Domain Registration",
  "SSL Certificates",
  "Custom Software Development",
  "Management Systems",
];

const HeroBanner = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-9xl md:text-6xl font-bold mb-4 animate-fade-in">
        Building the Future of Web and Mobile
      </h1>
      <p className="text-4xl mb-4 animate-fade-in">
        We create cutting-edge applications that drive business growth and user
        engagement as well as personal blogs.
      </p>
      <div className="text-6xl py-2 font-semibold mb-6 h-8 text-pink-700">
        <p className="animate-fade-in-up">{services[currentServiceIndex]}</p>
      </div>
      {/* <Link
        href="/pricing"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 animate-fade-in inline-block"
      >
        Get Started
      </Link> */}
    </div>
  );
};

export default HeroBanner;
