"use client";

import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error" | "alreadySubscribed"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message.includes("already subscribed")) {
          setStatus("alreadySubscribed");
        } else {
          setStatus("success");
          setEmail("");
        }
      } else {
        setStatus("error");
      }
      setMessage(data.message);
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-skin-fill text-skin-base p-6 rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Subscribe to Our Newsletter
      </h2>

      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-600" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300 flex-shrink-0"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "success" && <p className="text-green-500 mt-2">{message}</p>}
      {status === "alreadySubscribed" && (
        <p className="text-yellow-500 mt-2">{message}</p>
      )}
      {status === "error" && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
}
