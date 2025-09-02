import { z } from "zod";
export const contactSchema = z.object({
  email: z.string().email("email_validation"),
  phone: z
    .string()
    .regex(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "phone_validation"
    ),
  name: z.string().min(3, "name_validation"),
  subject: z.string().min(3, "subject_validation"),
  message: z.string().min(10, "message_validation"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
