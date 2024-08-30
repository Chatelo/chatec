"use client";

import { useState } from "react";
import BlogPosts from "./BlogPosts";
import SearchBar from "@/app/components/SearchBar";
import { Post } from "@/app/types";

export default function BlogPageClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = initialPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchBar onSearch={setSearchQuery} />
      <BlogPosts initialPosts={filteredPosts} />
    </>
  );
}
