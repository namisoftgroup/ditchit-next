import serverAxios from "@/lib/axios/serverAxios";
import { ProductDetailsResponse } from "./types";

export async function getProductDetails(
  id: string
): Promise<ProductDetailsResponse> {
  try {
    const res = await serverAxios.get(`/home/post/${id}`);

    return res.data.data;
  } catch (error) {
    console.error("Error fetching post: " + id, error);
    throw new Error("Failed to fetch post" + id);
  }
}
