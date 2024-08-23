import Link from "next/link";
import { getPosts, deletePost, getCurrentUser } from "@/app/lib/actions";
import { redirect } from "next/navigation";

export default async function AdminBlog() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  const posts = await getPosts(1, 100, user.id);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Manage Blog Posts</h1>
      <Link
        href="/admin/blog/new"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Post
      </Link>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th className="text-left">Author</th>
            <th className="text-left">Created At</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author.name}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
              <td>
                <Link
                  href={`/admin/blog/edit/${post.id}`}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </Link>
                <form
                  action={deletePost.bind(null, post.id)}
                  method="POST"
                  className="inline"
                >
                  <button type="submit" className="text-red-500">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
