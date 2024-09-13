import React from "react";

const EmailTemplate = () => (
  <div
    className="font-sans max-w-[600px] mx-auto p-5 bg-gray-100 rounded-lg"
    style={{ backgroundColor: "#f7f7f7" }}
  >
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1
        className="text-2xl text-gray-800 mb-5 text-center font-bold"
        style={{ color: "#333333" }}
      >
        Welcome to Our Newsletter!
      </h1>
      <p
        className="text-base text-gray-600 mb-4 leading-relaxed"
        style={{ color: "#666666" }}
      >
        Thank you for subscribing to our newsletter. We're excited to have you
        on board!
      </p>
      <p
        className="text-base text-gray-600 mb-6 leading-relaxed"
        style={{ color: "#666666" }}
      >
        You'll be receiving our latest updates and exclusive content soon.
      </p>
      <div className="text-center">
        <a
          href="https://sigira.com"
          className="bg-green-500 text-white px-6 py-3 rounded-md text-base font-bold inline-block no-underline hover:bg-green-600 transition duration-300"
          style={{ backgroundColor: "#4CAF50" }}
        >
          Visit Our Website for More
        </a>
      </div>
    </div>
    <div
      className="text-center mt-5 text-sm text-gray-500"
      style={{ color: "#999999" }}
    >
      © 2024 Sigira Technologies. All rights reserved.
    </div>
  </div>
);

export default EmailTemplate;
