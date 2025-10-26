import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("email_validation"),
  password: z.string().min(1, "password_required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    image: z.optional(z.instanceof(File)),
    name: z.string().min(3, "name_validation"),
    email: z.string().email("email_validation"),
    latitude: z.number(),
    longitude: z.number(),
    phone: z
      .string()
      .regex(
        /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{6})$/,
        "phone_validation"
      )
      .optional()
      .or(z.literal("")),
    address: z.string().min(3, "address_validation"),
    password: z.string().min(6, "password_validation"),
    confirm_password: z
      .string()
      .min(6, "pass_confirm_length"),
    zip_code: z
      .string()
      .regex(/^[0-9]{5}$/, "zipcode_validation")
      .optional()
      .or(z.literal("")),
    country_id: z.string().min(1, "country_validation"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "password_dont_match",
    path: ["confirm_password"], 
  });

export type registerFormValues = z.infer<typeof registerSchema>;

export const resetPassSchema = z
  .object({
    password: z.string().min(6, "password_validation"),
    confirm_password: z.string().min(6, "pass_confirm_length"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        code: z.ZodIssueCode.custom,
        message: "password_dont_match",
      });
    }
  });
console.log(registerSchema, resetPassSchema);

export type ResetPassFormValues = z.infer<typeof resetPassSchema>;
