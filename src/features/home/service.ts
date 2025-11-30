import { CategoryResponse, HomeFilterInterface } from "./types";
import { Post } from "@/types/post";
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

export async function getCategoryPosts(
  pageParam = 2,
  value: number,
  request: HomeFilterInterface
): Promise<{ data: Post[]; message: string; code: number }> {
  try {
    const res = await clientAxios.get("/home/paginatePosts", {
      params: {
        type: "category",
        page: pageParam,
        value,
        ...request,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching category posts:", error);
    throw new Error("Failed to fetch category posts");
  }
}



// export async function sendAverageByImage(payload) {
//   try {
//     const response = await clientAxios.post("/home/getAverageByImage", payload ,{
//       headers:{
//         "Content-Type":"multi"
//       }
//     });
//     return response.data;
//   } catch (error: unknown) {
//     console.error("Contact form submission error:", error);

//     return {
//       success: false,
//       message: "An unexpected error occurred",
//     };
//   }
// }
