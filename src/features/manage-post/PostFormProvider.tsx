"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["sale", "wanted"]),
  category_id: z.number(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),

  price: z.string().regex(/^[0-9]+(\.[0-9]{1,2})?$/, "price must be a number"),
  firm_price: z.union([z.literal(0), z.literal(1)]),
  virtual_tour: z.union([z.literal(0), z.literal(1)]),
  delivery_method: z.string(),
  is_promote: z.boolean(),
  condition: z.enum(["new", "used"], {
    required_error: "Condition is required",
  }),
  zip_code: z
    .string()
    .regex(
      /^[0-9]{5}$/,
      "Invalid zip code. Please enter a valid 5-digit zip code"
    ),
  features: z
    .array(z.string().min(3, "Feature must be at least 3 characters"))
    .optional(),
  options: z.array(
    z.object({
      category_option_id: z.number(),
      value: z.union([z.string(), z.number()]),
    })
  ),
});

export type PostFormData = z.infer<typeof schema>;

const PostFormContext = createContext<{
  step: number;
  next: () => void;
  back: () => void;
} | null>(null);

export const usePostForm = () => {
  const ctx = useContext(PostFormContext);
  if (!ctx) throw new Error("PostFormContext is not available");
  return ctx;
};

export default function PostFormProvider({
  children,
  postId,
  type,
}: {
  postId?: string | null;
  type?: string;
  children: ReactNode;
}) {
  const [step, setStep] = useState(0);
  console.log(postId);

  const methods = useForm<PostFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      type: type === "sale" || type === "wanted" ? type : "sale",
      condition: undefined,
      title: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
      category_id: 0,
      zip_code: "",
      price: "",
      firm_price: 0,
      virtual_tour: 0,
      delivery_method: "shipping",
      features: [],
      options: [],
      is_promote: false,
    },
  });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const contextValue = useMemo(() => ({ step, next, back }), [step]);

  return (
    <PostFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </PostFormContext.Provider>
  );
}
