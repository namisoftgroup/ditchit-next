"use client";

import { useEffect, useState } from "react";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/features/auth/store";
import { editProfileFormValues, editProfileSchema } from "../schema";
import InputField from "@/components/shared/InputField";
import clientAxios from "@/lib/axios/clientAxios";
import ZipMapSearch from "@/components/shared/ZipMapSearch";

export default function EditProfileForm() {
  const { user, setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("auth");

  const methods = useForm<editProfileFormValues>({
    mode: "onChange",
    resolver: zodResolver(editProfileSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (user?.id) {
      reset({
        name: user.name,
        email: user.email,
        zip_code: user.zip_code?.toString(),
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
      });
    }
  }, [reset, user]);

  const handleFormSubmit = async (data: editProfileFormValues) => {
    setIsPending(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "image" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      const res = await clientAxios.post("/profile/updateProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.data.code === 200) {
        setUser(res.data.data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(res?.data.message || "update profile failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-[16px]"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <AvatarUpload
          onImageChange={(file) => setValue("image", file)}
          initialImage={user?.image}
        />

        <InputField
          label={t("user_name")}
          id="username"
          placeholder={t("user_name")}
          {...register("name")}
          error={errors.name?.message ? t(errors.name?.message) : undefined}
        />

        <InputField
          label={t("email")}
          type="email"
          id="email"
          placeholder={t("email")}
          {...register("email")}
          error={errors.email?.message ? t(errors.email?.message) : undefined}
        />

        <InputField
          label={t("password")}
          type="password"
          id="password"
          placeholder={t("password")}
          {...register("password")}
          error={
            errors.password?.message ? t(errors.password?.message) : undefined
          }
        />

        <InputField
          label={t("zip_code")}
          id="zip_code"
          placeholder={t("enter_zip")}
          {...register("zip_code")}
          error={
            errors.zip_code?.message ? t(errors.zip_code?.message) : undefined
          }
        />

        <InputField
          id="address"
          readOnly
          placeholder={t("address")}
          {...register("address")}
          error={
            errors.address?.message ? t(errors.address?.message) : undefined
          }
        />

        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />

        <ZipMapSearch />

        <button
          type="submit"
          className="customBtn rounded-full w-fit px-12 ms-auto me-0 mt-4"
          disabled={isPending}
        >
          {isPending ? t("loading") : t("update")}
        </button>
      </form>
    </FormProvider>
  );
}
