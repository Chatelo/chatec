"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createPost } from "@/app/lib/actions";
import { SessionUser } from "@/app/types";

// Function to generate slug from title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Generate slug from title using useMemo
  const slug = useMemo(() => generateSlug(title), [title]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !(session.user as SessionUser).isAdmin) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({ title, content, slug });
      router.push("/admin/blog");
    } catch (error) {
      console.error("Failed to create post:", error);
      // Display the error message to the user
      alert(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !(session.user as SessionUser).isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={10}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Generated Slug</label>
          <p className="p-2 bg-gray-100 rounded">{slug}</p>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
