"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    if (searchParams.error) {
      console.error("Auth error:", searchParams.error);
    }
  }, [searchParams.error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Authentication Error</h1>
      <p className="mb-4">
        {searchParams.error || "An error occurred during authentication."}
      </p>
      <button
        onClick={() => router.push("/auth/signin")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Sign In
      </button>
    </div>
  );
}
