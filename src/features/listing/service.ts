import { listingResponse } from "./types";
import serverAxios from "@/lib/axios/serverAxios";
import clientAxios from "@/lib/axios/clientAxios";

export async function getFilteredPosts(
  pageParam = 1
): Promise<listingResponse> {
  try {
    const res = await serverAxios.post("/home/posts", {
      page: pageParam,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getClientFilteredPosts(
  pageParam = 1
): Promise<listingResponse> {
  try {
    const res = await clientAxios.post("/home/posts", {
      page: pageParam,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
