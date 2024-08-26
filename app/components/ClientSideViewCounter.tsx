"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface ClientSideViewCounterProps {
  slug: string;
  initialViews: number;
}

export default function ClientSideViewCounter({
  slug,
  initialViews,
}: ClientSideViewCounterProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const incrementView = async () => {
      try {
        const response = await fetch("/api/incrementView", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });
        const data = await response.json();
        if (data.views) {
          setViews(data.views);
        }
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    };

    incrementView();
  }, [slug]);

  return (
    <p className="text-gray-500 mb-8 flex items-center">
      <EyeIcon className="h-6 w-6 mr-2" />
      <span>{views}</span>
    </p>
  );
}
