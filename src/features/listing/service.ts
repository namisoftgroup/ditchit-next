import { listingResponse, PostsFilterPayload } from "./types";
import serverAxios from "@/lib/axios/serverAxios";
import clientAxios from "@/lib/axios/clientAxios";

export async function getFilteredPosts(
  request: PostsFilterPayload
): Promise<listingResponse> {
  try {
    const res = await serverAxios.post("/home/posts", request);
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getClientFilteredPosts(
  request: PostsFilterPayload
): Promise<listingResponse> {
  try {
    const res = await clientAxios.post("/home/posts", request);

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
