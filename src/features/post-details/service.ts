import serverAxios from "@/lib/axios/serverAxios";
import { PostDetailsResponse } from "./types";

export async function getPostDetails(id: string): Promise<PostDetailsResponse> {
  try {
    const res = await serverAxios.get(`/home/post/${id}`);

    return res.data.data;
  } catch (error) {
    console.error("Error fetching post: " + id, error);
    throw new Error("Failed to fetch post" + id);
  }
}
