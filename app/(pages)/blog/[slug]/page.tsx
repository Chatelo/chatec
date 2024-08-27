import { Metadata } from "next";
import { deletePost, getPostBySlug } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import ClientSideViewCounter from "@/app/components/ClientSideViewCounter";

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
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <p className="text-gray-500 mb-4">By {post.author.name}</p>
      <p className="text-gray-500 mb-2">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <ClientSideViewCounter slug={post.slug} initialViews={post.views} />
      <div
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <form
        action={deletePost.bind(null, post.id)}
        method="POST"
        className="inline"
      >
        <button type="submit" className="text-red-500">
          Delete
        </button>
      </form>
    </div>
  );
}
