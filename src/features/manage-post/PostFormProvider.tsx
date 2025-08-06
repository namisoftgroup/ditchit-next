"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import clientAxios from "@/lib/axios/clientAxios";
import useGetMyPosts from "@/hooks/queries/useGetMyPosts";

const schema = z.object({
  type: z.enum(["sale", "wanted"]),
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
  image: z.instanceof(File),
  images: z.array(z.instanceof(File)).optional(),
  condition: z.enum(["new", "used"], {
    required_error: "Condition is required",
  }),
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

export type PostFormData = z.infer<typeof schema>;

const PostFormContext = createContext<{
  step: number;
  next: () => void;
  back: () => void;
  savePost: (data: PostFormData) => void;
  isSaving: boolean;
} | null>(null);

export const usePostForm = () => {
  const ctx = useContext(PostFormContext);
  if (!ctx) throw new Error("PostFormContext is not available");
  return ctx;
};

export default function PostFormProvider({
  children,
  type,
}: {
  postId?: string | null;
  type?: string;
  children: ReactNode;
}) {
  const [step, setStep] = useState(0);
  const { refetch } = useGetMyPosts();
  const router = useRouter();

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
      is_promote: 0,
      image: undefined,
      images: [],
    },
  });

  const { mutate: savePostMutation, isPending: isSaving } = useMutation({
    mutationFn: async (data: PostFormData) => {
      return await clientAxios.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },

    onSuccess: (data) => {
      if (data.data.code == 200) {
        toast.success("Post saved successfully");
        refetch();
        router.push("/profile");
      } else {
        toast.error(data.data.message);
      }
    },

    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },

    onSettled: () => {
      if (typeof window !== "undefined") {
        const event = new CustomEvent("close-post-modal");
        window.dispatchEvent(event);
      }
    },
  });

  const savePost = (data: PostFormData) => {
    savePostMutation(data);
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const contextValue = useMemo(
    () => ({
      step,
      next,
      back,
      savePost,
      isSaving,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step, isSaving]
  );

  return (
    <PostFormContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </PostFormContext.Provider>
  );
}
