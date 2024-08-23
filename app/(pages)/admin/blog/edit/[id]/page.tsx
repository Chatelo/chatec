"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPost, updatePost } from "@/app/lib/actions";

export default function EditPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<{
    id: number;
    title: string;
    content: string;
    slug: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const post = await getPost(parseInt(params.id));
      if (post) {
        setPost(post);
        setTitle(post.title);
        setContent(post.content);
        setSlug(post.slug);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (post) {
      await updatePost(post.id, { title, content, slug });
      router.push("/admin/blog");
    }
  };

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
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
          <label htmlFor="slug" className="block mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
