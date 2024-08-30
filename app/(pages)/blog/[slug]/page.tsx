import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPostBySlug } from "@/app/lib/actions";
import ClientSideViewCounter from "@/app/components/ClientSideViewCounter";
import DeleteButton from "./DeleteButton";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { serializeContent } from "@/app/utils/contentSerializer";

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: `${post.title} by ${post.author.name}`,
    openGraph: {
      images: [
        {
          url: post.imageUrl ?? "",
        },
      ],
    },
  };
}

async function fetchPost(slug: string) {
  return await getPostBySlug(slug);
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await fetchPost(params.slug);

  if (!post) {
    notFound();
  }

  const contentHtml = serializeContent(post.content);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <p className="text-gray-500 mb-4">By {post.author.name}</p>
      <p className="text-gray-500 mb-2">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <Suspense fallback={<LoadingSpinner />}>
        <ClientSideViewCounter slug={post.slug} initialViews={post.views} />
      </Suspense>
      <div
        className="prose lg:prose-xl mt-8"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <DeleteButton postId={post.id.toString()} />
      </Suspense>
    </div>
  );
}
