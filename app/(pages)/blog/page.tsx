import { Suspense } from "react";
import { getPosts } from "@/app/lib/actions";
import BlogPageClient from "./BlogPageClient";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export const revalidate = 3600; // revalidate every hour

async function fetchInitialPosts() {
  const initialPosts = await getPosts(1, 10);
  return initialPosts.posts;
}

export default async function BlogPage() {
  const initialPosts = await fetchInitialPosts();

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Blogs</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <BlogPageClient initialPosts={initialPosts} />
      </Suspense>
    </div>
  );
}
