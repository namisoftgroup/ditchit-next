import { z } from "zod";

export const passwordSchema = z
  .object({
    // current_password: z
    //   .string()
    //   .min(6, "password_validation")
    //   .optional()
    //   .or(z.literal("")),
    new_password: z
      .string()
      .min(6, "password_validation")
      .optional()
      .or(z.literal("")),
    confirm_new_password: z
      .string()
      .min(6, "password_validation")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "password_dont_match",
    path: ["confirm_new_password"],
  });

export type changePasswordSchema = z.infer<typeof passwordSchema>;
