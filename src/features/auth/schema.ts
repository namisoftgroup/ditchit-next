import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  image: z.optional(z.instanceof(File)),
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  latitude: z.number(),
  longitude: z.number(),
  phone: z
    .string()
    .regex(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Invalid phone number. Please enter a valid 10-digit US phone number, e.g., 123-456-7890"
    ),
  address: z.string().min(3, "Address must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  zip_code: z
    .string()
    .regex(
      /^[0-9]{5}$/,
      "Invalid zip code. Please enter a valid 5-digit zip code"
    ),
});

export type registerFormValues = z.infer<typeof registerSchema>;

export const resetPassSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),

    confirm_password: z
      .string()
      .min(6, "Password confirmation must be at least 6 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }
  });

export type ResetPassFormValues = z.infer<typeof resetPassSchema>;
