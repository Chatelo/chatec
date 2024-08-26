import { NextRequest, NextResponse } from "next/server";
import { updatePost } from "@/app/lib/actions";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const postData = await request.json();
  try {
    const updatedPost = await updatePost(parseInt(params.id), postData);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}
