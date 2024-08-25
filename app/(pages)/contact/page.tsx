"use client";

import { useState } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sigira Technologies for your web and mobile development needs. We're here to answer your questions and discuss your project requirements.ß",
  openGraph: {
    title: "Contact",
    description:
      "Reach out to us for cutting-edge web and mobile solutions. Let's discuss how we can bring your ideas to life.",
    url: "https://sigira.com/contact",
    type: "website",
    images: [
      {
        url: "https://sigira.com/android-192x192.png",
        width: 1200,
        height: 630,
        alt: "Sigira Technologies contact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Connect with us for innovative web and mobile solutions. We're ready to help you achieve your digital goals.",
    images: ["https://sigira.com/sigira-og.png"],
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your API
    console.log(formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-4">
            We&apos;d love to hear from you. Please fill out this form.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 mb-4 border rounded"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-2">Email: chatectechnologies@gmailcom</p>
          <p className="mb-2">Phone: (+254) 729-057-932</p>
          <p className="mb-2">Address: Bomet</p>
        </div>
      </div>
    </div>
  );
}
