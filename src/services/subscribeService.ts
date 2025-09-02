import { z } from "zod";
import clientAxios from "@/lib/axios/clientAxios";
import axios, { AxiosError } from "axios";

export const subscribeSchema = z.object({
  country: z.string().min(1, "country_required").trim(),
  mobile: z
    .string()
    .regex(
      /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
      "phone_validation"
    )
    .trim(),
  first_name: z.string().min(2, "first_name_validation").trim(),
  last_name: z.string().min(2, "last_name_validation").trim(),
});

export type SubscribeFormValues = z.infer<typeof subscribeSchema>;

export async function subscribeService(data: SubscribeFormValues) {
  try {
    const response = await clientAxios.post("main/subscribe", data);
    return response.data;
  } catch (error: unknown) {
    console.error("Subscription service error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Failed to process subscription request",
      };
    }

    return {
      success: false,
      message: "An unexpected error occurred during subscription",
    };
  }
}
