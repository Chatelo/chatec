"use client";

import { useSession } from "next-auth/react";
import { deletePost } from "@/app/lib/actions";

export default function DeleteButton({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin || false;

  if (!isAdmin) return null;

  return (
    <form
      action={deletePost.bind(null, parseInt(postId))}
      method="POST"
      className="inline"
    >
      <button type="submit" className="text-red-500">
        Delete
      </button>
    </form>
  );
}
