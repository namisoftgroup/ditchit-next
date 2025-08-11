import serverAxios from "@/lib/axios/serverAxios";
import clientAxios from "@/lib/axios/clientAxios";
import { advertiserResponse } from "./types";

export async function getAdvertiserServerPosts(
  advertiserId: string,
  page: number
): Promise<advertiserResponse> {
  try {
    const res = await serverAxios.get(
      `/home/user/${advertiserId}?page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getAdvertiserPosts(
  advertiserId: string,
  page: number
): Promise<advertiserResponse> {
  try {
    const res = await clientAxios.get(
      `/home/user/${advertiserId}?page=${page}`
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
