import clientAxios from "@/lib/axios/clientAxios";
import axios from "axios";

export async function sendCode(email: string) {
  try {
    const response = await clientAxios.post("/auth/sendCode", { email });
    return response.data;

  } catch (error: unknown) {
    console.error("sendCodeClient error:", error);
    if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.response?.data);
        
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
