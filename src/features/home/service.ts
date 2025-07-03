import serverAxios from "@/lib/axios/serverAxios";
import { CategoryResponse } from "./types";

export async function getHomeCategories(pageParam = 1): Promise<CategoryResponse> {
  try {
    const res = await serverAxios.get("/home", {
      params: {
        page: pageParam,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}
