import { z } from "zod";

export const editProfileSchema = z.object({
  image: z.optional(z.instanceof(File)),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(3, "Address must be at least 3 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),

  zip_code: z
    .string()
    .regex(
      /^[0-9]{5}$/,
      "Invalid zip code. Please enter a valid 5-digit zip code"
    ),
});

export type editProfileFormValues = z.infer<typeof editProfileSchema>;
