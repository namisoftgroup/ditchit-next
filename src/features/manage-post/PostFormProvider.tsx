"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { PostDetailsResponse } from "../post-details/types";
import { useRouter } from "next/navigation";
import { PostFormData, postFormDataSchema } from "./schema";
import clientAxios from "@/lib/axios/clientAxios";

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
  post,
}: {
  post?: PostDetailsResponse;
  type?: string;
  children: ReactNode;
}) {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const methods = useForm<PostFormData>({
    resolver: zodResolver(postFormDataSchema),
    mode: "onChange",
    defaultValues: {
      type: post?.type || type,
      category_id: post?.category.id || 0,

      image: post?.image || undefined,
      images: post?.images?.map((img) => img.image) || [],
      title: post?.title || "",
      description: post?.description || "",
      zip_code: post?.zip_code || "",
      address: post?.description || "",
      latitude: post?.latitude || 0,
      longitude: post?.longitude || 0,

      condition: post?.condition || undefined,
      features: post?.features?.map((f) => f.value) || [],
      options:
        post?.options?.map((opt) => ({
          category_option_id: opt.category_option_id,
          value: opt.value,
        })) || [],

      price: post?.price.toString() || "",
      is_promote: post?.is_promoted === true ? 1 : 0,
      firm_price: post?.firm_price === true ? 1 : 0,
      virtual_tour: post?.virtual_tour === true ? 1 : 0,

      delivery_method:
        post?.delivery_method === "Local + Shipping"
          ? "both"
          : post?.delivery_method,
    },
  });

  const { mutate: savePostMutation, isPending: isSaving } = useMutation({
    mutationFn: async (data: PostFormData) => {
      const endpoint = post?.id ? `/posts/${post.id}` : "/posts";
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" || key === "images") return;

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              Object.entries(item).forEach(([k, v]) => {
                formData.append(`${key}[${index}][${k}]`, v);
              });
            } else {
              formData.append(`${key}[]`, item);
            }
          });
        } else {
          formData.append(key, value as string);
        }
      });

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (Array.isArray(data.images)) {
        const fileImages = data.images.filter((img) => img instanceof File);
        fileImages.forEach((img) => {
          formData.append("images[]", img);
        });
      }

      if (post?.id) {
        formData.append("_method", "PUT");
      }

      return await clientAxios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: (data) => {
      if (data.data.code == 200) {
        if (data.data.data.link) {
          window.location.href = data.data.data.link;
        } else {
          toast.success("Post saved successfully");
          router.push("/profile");
        }
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
