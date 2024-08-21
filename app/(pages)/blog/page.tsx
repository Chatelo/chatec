"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchBar from "@/app/components/SearchBar";
import { getPosts } from "@/app/lib/actions";

interface Post {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  author: {
    name: string;
  };
}

const POSTS_PER_PAGE = 10;

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    const newPosts = await getPosts(page, POSTS_PER_PAGE);
    setPosts((prevPosts) => {
      const updatedPosts: Post[] = [];
      for (const post of [...prevPosts, ...newPosts]) {
        updatedPosts.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          createdAt: new Date(post.createdAt).toISOString(),
          author: {
            name: post.author.name,
          },
        });
      }
      return updatedPosts;
    });
    setHasMore(newPosts.length === POSTS_PER_PAGE);
    setPage((prevPage) => prevPage + 1);
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = useCallback(async (query: string) => {
    const searchedPosts = await getPosts(1, POSTS_PER_PAGE, query);
    setPosts(
      searchedPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        createdAt: new Date(post.createdAt).toISOString(),
        author: {
          name: post.author.name || "",
        },
      }))
    );
    setHasMore(searchedPosts.length === POSTS_PER_PAGE);
    setPage(1);
  }, []);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Blogs</h1>
      <SearchBar onSearch={handleSearch} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-500">By {post.author.name}</p>
              <p className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-blue-500 mt-4">Read more →</p>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
