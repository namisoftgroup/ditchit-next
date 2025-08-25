import { CategoryResponse, HomeFilterInterface } from "./types";
import serverAxios from "@/lib/axios/serverAxios";
import clientAxios from "@/lib/axios/clientAxios";

export async function getHomeCategories(
  pageParam = 1,
  request: HomeFilterInterface
): Promise<CategoryResponse> {
  try {
    const res = await serverAxios.get("/home", {
      params: {
        page: pageParam,
        ...request,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching home categories:", error);
    throw new Error("Failed to fetch home categories");
  }
}

export async function getClientHomeCategories(
  pageParam = 1,
  request: HomeFilterInterface
): Promise<CategoryResponse> {
  try {
    const res = await clientAxios.get("/home", {
      params: {
        page: pageParam,
        ...request,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching home categories in client side:", error);
    throw new Error("Failed to fetch home categories in client side");
  }
}
