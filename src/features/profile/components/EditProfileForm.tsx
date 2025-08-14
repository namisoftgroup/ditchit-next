"use client";

import { useEffect, useState } from "react";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store";
import { editProfileFormValues, editProfileSchema } from "../schema";
import InputField from "@/components/shared/InputField";
import clientAxios from "@/lib/axios/clientAxios";
import ZipMapSearch from "@/components/shared/ZipMapSearch";

export default function EditProfileForm() {
  const { user, setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);

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
          label="User Name"
          id="username"
          placeholder="User Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <InputField
          label="Email"
          type="email"
          id="email"
          placeholder="Email"
          {...register("email")}
          error={errors.email?.message}
        />

        <InputField
          label="Password"
          type="password"
          id="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password?.message}
        />

        <InputField
          label="Zip Code"
          id="zip_code"
          placeholder="Enter ZIP Code"
          {...register("zip_code")}
          error={errors.zip_code?.message}
        />

        <InputField
          id="address"
          readOnly
          placeholder="Address"
          {...register("address")}
          error={errors.address?.message}
        />

        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />

        <ZipMapSearch />

        <button
          type="submit"
          className="customBtn rounded-full w-fit px-12 ms-auto me-0 mt-4"
          disabled={isPending}
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>
    </FormProvider>
  );
}
