import serverAxios from "@/lib/axios/serverAxios";
import { productResponse } from "./types";

export async function getProductDetails(id: number): Promise<productResponse> {
  try {
    const res = await serverAxios.get(`/home/post/${id}`);

    return res.data.data;
  } catch (error) {
    console.error("Error fetching product: " + id, error);
    throw new Error("Failed to fetch product" + id);
  }
}
