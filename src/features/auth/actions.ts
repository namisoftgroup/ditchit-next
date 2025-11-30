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
        httpOnly: false,
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

// export async function getProfile(): Promise<{
//   user: User | null;
//   token: string | null;
// }> {
//   if (!(await cookies()).get("token")) {
//     return {
//       user: null,
//       token: null,
//     };
//   }

//   try {
//     const response = await serverAxios.get(`${API_URL}/profile`);
//     const token = (await cookies()).get("token")?.value || null;

//     return {
//       user: response.data.data.user || null,
//       token,
//     };
//   } catch (error) {
//     console.error("Failed to fetch profile", error);
//     return {
//       user: null,
//       token: null,
//     };
//   }
// }



interface ProfileResponse {
  user: User | null;
  token: string | null;
}

let cachedProfile: ProfileResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30_000; // 30 seconds

export async function getProfile(): Promise<ProfileResponse> {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return {
      user: null,
      token: null,
    };
  }

  const now = Date.now();
  if (cachedProfile && now - lastFetchTime < CACHE_DURATION) {
    return cachedProfile;
  }

  try {
    const response = await serverAxios.get("/profile");
    const result: ProfileResponse = {
      user: response.data.data.user || null,
      token,
    };

    cachedProfile = result;
    lastFetchTime = now;
    return result;
  } catch (error ) {
    // if((error as AxiosError<{ message?: string }>).response?.status === 401) {
    //     redirect('/api/auth/logout');
    // }
    console.error("Failed to fetch profile", error);
    return {
      user: null,
      token: null,
    };
  }
}
/* ~~~~~~~~~~~~ logout action ~~~~~~~~~~~~ */

// export async function logOutAction() {
//   try {
//     await serverAxios.get(`${API_URL}/profile/logout`);
//   } catch (error) {
//     console.error("Failed to logout from server", error);
//   } finally {
//     (await cookies()).delete("token");
//     delete serverAxios.defaults.headers.common["Authorization"];
//     revalidatePath("/", "layout");
//   }
// }

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
        httpOnly: false,
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
