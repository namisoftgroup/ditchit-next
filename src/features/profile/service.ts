import clientAxios from "@/lib/axios/clientAxios";

type myPostsResponse = {
  data: [];
  message: string;
  code: number;
};

export async function getMyPosts(pageParam = 1): Promise<myPostsResponse> {
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
