import serverAxios from "@/lib/axios/serverAxios";

export async function getFilteredPosts(
  pageParam = 1
): Promise<CategoryResponse> {
  try {
    const res = await serverAxios.post("/home/posts", {
      params: {
        page: pageParam,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}