"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export const DigitalAgreementForm = () => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referralCode");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreementText: "",
    signature: "",
    referralCode: referralCode || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Agreement submitted successfully!");
        // TODO: Redirect to a thank you page or clear the form
      } else {
        alert("Failed to submit agreement. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting agreement:", error);
      alert("An error occurred while submitting the agreement.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Digital Agreement Form</h2>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="agreementText"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Agreement Text
        </label>
        <textarea
          id="agreementText"
          name="agreementText"
          value={formData.agreementText}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows={4}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="signature"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Digital Signature
        </label>
        <input
          type="text"
          id="signature"
          name="signature"
          value={formData.signature}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit Agreement
      </button>
    </form>
  );
};
