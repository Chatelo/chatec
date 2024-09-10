"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { getPosts } from "@/app/lib/actions";
import { Post } from "@/app/types";
import ClientSideViewCounter from "@/app/components/ClientSideViewCounter";

const POSTS_PER_PAGE = 10;

function getTextContent(content: any[]): string {
  return content
    .filter((block) => block.type === "paragraph")
    .map((block) => block.children.map((child: any) => child.text).join(""))
    .join(" ")
    .substring(0, 150);
}

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function BlogPosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadMorePosts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);
    try {
      const newPosts = await getPosts(page, POSTS_PER_PAGE);
      if (newPosts.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts.posts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore]);

  useEffect(() => {
    if (inView && !isLoading) {
      loadMorePosts();
    }
  }, [inView, isLoading, loadMorePosts]);

  return (
    <div className=" bg-skin-fill text-skin-base grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
        >
          <h2 className="text-2xl font-semibold mb-4 text-black">
            {post.title}
          </h2>
          <p className="text-gray-500">By {post.author.name}</p>
          <p className="text-gray-500">{formatDate(post.createdAt)}</p>
          <ClientSideViewCounter slug={post.slug} initialViews={post.views} />
          <p>
            {Array.isArray(post.content)
              ? getTextContent(post.content)
              : typeof post.content === "string"
              ? post.content.substring(0, 150)
              : "No content available"}
            ...
          </p>
          <p className="text-blue-500 mt-4">Read more →</p>
        </Link>
      ))}
      {hasMore && (
        <div ref={ref}>{isLoading && <p>Loading more posts...</p>}</div>
      )}
    </div>
  );
}
