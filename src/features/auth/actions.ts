"use server";

import { API_URL } from "@/utils/constants";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { revalidatePath } from "next/cache";
import serverAxios from "@/lib/axios/serverAxios";

/* ~~~~~~~~~~~~ login and register actions ~~~~~~~~~~~~ */

export async function authAction(formData: FormData, endPoint: string) {
  try {
    const response = await serverAxios.post(API_URL + endPoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const responseData = response.data;

    if (responseData.code === 200) {
      (await cookies()).set("token", responseData.data.auth.token, {
        path: "/",
        secure: true,
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

/* ~~~~~~~~~~~~ get profile action ~~~~~~~~~~~~ */

export async function getProfile(): Promise<{
  user: User | null;
  token: string | null;
}> {
  if (!(await cookies()).get("token")) {
    return {
      user: null,
      token: null,
    };
  }

  try {
    const response = await serverAxios.get(`${API_URL}/profile`);
    const token = (await cookies()).get("token")?.value || null;

    return {
      user: response.data.data.user || null,
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

/* ~~~~~~~~~~~~ logout action ~~~~~~~~~~~~ */

export async function logOutAction() {
  const res = await serverAxios.get(`${API_URL}/profile/logout`);

  if (res.data.code === 200) {
    (await cookies()).delete("token");
    delete serverAxios.defaults.headers.common["Authorization"];
    revalidatePath("/", "layout");
    return res.data;
  }
}

/* ~~~~~~~~~~~~ check code action ~~~~~~~~~~~~ */

export async function checkCodeAction(formData: FormData) {
  try {
    const response = await serverAxios.post(
      API_URL + "/auth/confirmCode",
      formData
    );
    const responseData = response.data;

    if (responseData.code === 200) {
      (await cookies()).set("tokenRestPass", responseData.data.auth.token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    // if (responseData.code === 200) {
    //   (await cookies()).set("verifiedReset", "true", {
    //     path: "/",
    //     maxAge: 60 * 5, // 5 دقائق فقط
    //   });
    // }

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
