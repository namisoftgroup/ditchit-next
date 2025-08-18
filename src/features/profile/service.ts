import { Post } from "@/types/post";
import clientAxios from "@/lib/axios/clientAxios";
import serverAxios from "@/lib/axios/serverAxios";

export interface MyPostsResponse {
  data: Post[];
  message: string;
  code: number;
}

export async function getMyPosts(pageParam = 1): Promise<MyPostsResponse> {
  try {
    const res = await serverAxios.get("/posts", {
      params: {
        page: pageParam,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching home categories in client side:", error);
    throw new Error("Failed to fetch home categories in client side");
  }
}

export async function getMyPostsClient(
  pageParam = 1
): Promise<MyPostsResponse> {
  try {
    const res = await clientAxios.get("/posts", {
      params: {
        page: pageParam,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching home categories in client side:", error);
    throw new Error("Failed to fetch home categories in client side");
  }
}

export async function getMyFavorites(): Promise<MyPostsResponse> {
  try {
    const res = await clientAxios.get("/profile/favorites");

    return res.data;
  } catch (error) {
    console.error("Error fetching home categories in client side:", error);
    throw new Error("Failed to fetch home categories in client side");
  }
}
