"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

// Define the CustomSession type
interface CustomSession {
  user: {
    id: string;
    email: string;
    isAdmin?: boolean;
  };
}

export const DigitalAgreementForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agreementText: "",
    signature: "",
  });
  const [session, setSession] = useState<CustomSession | null>(null); // Explicitly type the session

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/check-session");
      if (res.ok) {
        const data = await res.json();
        setSession(data.session); // Type will now match CustomSession
      } else {
        alert("You must be logged in to submit the agreement.");
        router.push("/auth/signin");
      }
    };
    fetchSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user) {
      alert("You must be logged in to submit the agreement.");
      return;
    }

    try {
      const result = await fetch("/api/submit-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId: session.user.id }), // Now session.user.id is correctly typed
      });

      if (result.ok) {
        alert("Agreement submitted successfully!");
        router.push("/contact");
      } else {
        alert("Failed to submit agreement. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting agreement:", error);
      alert("An error occurred while submitting the agreement.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <CardHeader>Digital Agreement Form</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
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
          <CardFooter>
            <Button type="submit">Submit Agreement</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
