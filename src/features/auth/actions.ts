"use server";

import { API_URL } from "@/utils/constants";
import { AxiosError } from "axios";
import serverAxios from "@/lib/axios/serverAxios";

export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await serverAxios.post(`${API_URL}/auth/login`, raw);
    return response.data;
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
