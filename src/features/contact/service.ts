import clientAxios from "@/lib/axios/clientAxios";
import axios from "axios";
import { ContactFormValues } from "./schema";

export async function sendContactForm(data: ContactFormValues) {
  try {
    const response = await clientAxios.post("/main/contact-us", data);
    return response.data;
  } catch (error: unknown) {
    console.error("Contact form submission error:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      console.error("API error response:", errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
