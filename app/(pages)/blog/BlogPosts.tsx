"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { getPosts } from "@/app/lib/actions";
import { Post } from "@/app/types";
import ClientSideViewCounter from "@/app/components/ClientSideViewCounter";

const POSTS_PER_PAGE = 10;

export default function BlogPosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [ref, inView] = useInView();

  const loadMorePosts = useCallback(async () => {
    const newPosts = await getPosts(page, POSTS_PER_PAGE);
    setPosts((prevPosts) => [...prevPosts, ...newPosts.posts]);
    setPage((prevPage) => prevPage + 1);
  }, [page]);

  if (inView) {
    loadMorePosts();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <p className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <ClientSideViewCounter slug={post.slug} initialViews={post.views} />
          <p>{post.content.substring(0, 150)}...</p>
          <p className="text-blue-500 mt-4">Read more →</p>
        </Link>
      ))}
      <div ref={ref}></div>
    </div>
  );
}
