import { z } from "zod";

const fileOrStringSchema = z.union([z.instanceof(File), z.string()]);

export const postFormDataSchema = z.object({
  type: z.string(),
  category_id: z.number(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  price: z.string().regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Price must be a number"),
  firm_price: z.union([z.literal(0), z.literal(1)]),
  virtual_tour: z.union([z.literal(0), z.literal(1)]),
  delivery_method: z.string(),
  is_promote: z.union([z.literal(0), z.literal(1)]).optional(),
  image: fileOrStringSchema,
  images: z.array(fileOrStringSchema).optional(),
  condition: z.string(),
  zip_code: z
    .string()
    .regex(
      /^[0-9]{5}$/,
      "Invalid zip code. Please enter a valid 5-digit zip code"
    ),
  features: z.array(z.string().min(3)).optional(),
  options: z.array(
    z.object({
      category_option_id: z.number(),
      value: z.union([z.string(), z.number()]),
    })
  ),
});

export type PostFormData = z.infer<typeof postFormDataSchema>;
