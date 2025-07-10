"use server";

import { API_URL } from "@/utils/constants";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import serverAxios from "@/lib/axios/serverAxios";

export async function loginAction(formData: FormData) {
  try {
    const response = await serverAxios.post(`${API_URL}/auth/login`, formData);
    const responseData = response.data;

    if (responseData.code === 200) {
      (await cookies()).set("token", responseData.data.auth.token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return responseData;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    const message =
      err.response?.data?.message || "Something went wrong during login";

    return {
      success: false,
      message,
    };
  }
}

export async function getProfile(): Promise<{
  user: User | null;
  token: string | null;
}> {
  try {
    const response = await serverAxios.get(`${API_URL}/profile`);
    const token = (await cookies()).get("token")?.value || null;

    return {
      user: response.data.user || null,
      token,
    };
  } catch (error) {
    console.error("Failed to fetch profile", error);
    return {
      user: null,
      token: null,
    };
  }
}
