"use server";

import { API_URL } from "@/utils/constants";
import { loginSchema } from "./schema";
import { AxiosError } from "axios";
import serverAxios from "@/lib/axios/serverAxios";


// Login service
export async function loginAction(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await serverAxios.post(
      `${API_URL}/auth/login`,
      result.data
    );

    return {
      success: true,
      message: "Logged in successfully",
      data: response.data,
    };
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
