import { Metadata } from "next";
import { deletePost, getPostBySlug } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import ClientSideViewCounter from "@/app/components/ClientSideViewCounter";
import DeleteButton from "./DeleteButton";
import escapeHtml from "escape-html";
import { Text } from "slate";

const serialize = (node: any): string => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }
    return string;
  }

  const children = node.children.map((n: any) => serialize(n)).join("");

  switch (node.type) {
    case "block-quote":
      return `<blockquote>${children}</blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "heading-one":
      return `<h1>${children}</h1>`;
    case "heading-two":
      return `<h2>${children}</h2>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "image":
      return `<img src="${escapeHtml(node.url)}" alt="Image" />`;
    default:
      return children;
  }
};

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

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const contentHtml = Array.isArray(post.content)
    ? post.content.map(serialize).join("")
    : typeof post.content === "string"
    ? post.content
    : "";

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
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <DeleteButton postId={post.id.toString()} />
    </div>
  );
}
