import { getPostBySlug } from "@/app/lib/actions";
import { notFound } from "next/navigation";

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
      <p className="text-gray-500 mb-8">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div
        className="prose lg:prose-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
