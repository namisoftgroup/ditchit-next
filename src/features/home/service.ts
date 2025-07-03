import { CategoryResponse } from "./types";
import serverAxios from "@/lib/axios/serverAxios";
import clientAxios from "@/lib/axios/clientAxios";

export async function getHomeCategories(
  pageParam = 1
): Promise<CategoryResponse> {
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

export async function getClientHomeCategories(
  pageParam = 1
): Promise<CategoryResponse> {
  try {
    const res = await clientAxios.get("/home", {
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
