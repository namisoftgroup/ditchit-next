import { z } from "zod";

export const editProfileSchema = z.object({
  image: z.optional(z.instanceof(File)),
  name: z.string().min(3, "name_validation"),
  email: z.string().email("email_validation"),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(3, "address_validation"),
  password: z
    .string()
    .min(6, "password_validation")
    .optional()
    .or(z.literal("")),

  zip_code: z
    .string()
    .regex(
      /^[0-9]{5}$/,
      "zipcode_validation"
    ),
});

export type editProfileFormValues = z.infer<typeof editProfileSchema>;
