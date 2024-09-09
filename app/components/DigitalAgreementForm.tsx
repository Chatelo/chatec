"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export const DigitalAgreementForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agreementText: "",
    signature: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) {
        alert("You must be logged in to submit the agreement.");
        return;
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        alert("User not found.");
        return;
      }

      const result = await fetch("/api/submit-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userId: user.id }),
      });

      if (result.ok) {
        alert("Agreement submitted successfully!");
        router.push("/dashboard");
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
