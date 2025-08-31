import serverAxios from "@/lib/axios/serverAxios";
import { PostDetailsResponse } from "./types";
import clientAxios from "@/lib/axios/clientAxios";

export async function getPostDetails(
  id: string,
  userId?: number | null
): Promise<PostDetailsResponse> {
  try {
    const res = await serverAxios.get(`/home/post/${id}`, {
      params: {
        user_id: userId ?? undefined,
      },
    });

    return res.data.data;
  } catch (error) {
    console.error("Error fetching post:", id, error);
    throw new Error("Failed to fetch post " + id);
  }
}

export async function generate(postId: number) {
  try {
    const res = await clientAxios.get(`/chat/create?post_id=${postId}`);
    return res.data.data;
  } catch (error) {
    console.error("Error generating room for post: " + postId, error);
  }
}

export async function reportPost({
  postId,
  reason,
}: {
  postId: number;
  reason: string;
}) {
  try {
    const res = await clientAxios.post("posts/reportPost", {
      post_id: postId,
      reason,
    });
    return res;
  } catch (error) {
    console.error("Error reporting post:", postId, error);
  }
}
