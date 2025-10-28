"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { changePasswordSchema, passwordSchema } from "../passwordSchema";
import InputField from "@/components/shared/InputField";
import clientAxios from "@/lib/axios/clientAxios";
import { toast } from "sonner";
import { API_URL } from "@/utils/constants";
import { useState } from "react";

export default function ChangePasswordForm() {
  // const { user, setUser } = useAuthStore();
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("auth");
  // const router = useRouter();

  const methods = useForm<changePasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = methods;

  const onSubmit = async (values: changePasswordSchema) => {
    setIsPending(true);

    try {
      const res = await clientAxios.post(API_URL + "/auth/updatePassword", {
        password: values.new_password,
        type: "change",
      });

      if (res.data.code === 200) {
        toast.success(t("password_updated"));
        reset();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(t("something_went_wrong"));
    } finally {
      setIsPending(false);
    }
  };

  // const handleFormSubmit = async (data: changePasswordSchema) => {
  //   setIsPending(true);
  //   const formData = new FormData();

  //   Object.entries(data).forEach(([key, value]) => {
  //     if (value !== undefined && value !== null) {
  //       if (key === "image" && value instanceof File) {
  //         formData.append(key, value);
  //       } else {
  //         formData.append(key, value.toString());
  //       }
  //     }
  //   });

  //   try {
  //     const res = await clientAxios.post("/profile/updateProfile", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });
  //     if (res?.data.code === 200) {
  //       setUser(res.data.data.user);
  //       toast.success(t("update"));
  //     } else {
  //       toast.error(res?.data.message || "update profile failed");
  //     }
  //   } catch (error) {
  //     console.error("Submit error:", error);
  //     toast.error(t("something_went_wrong"));
  //   } finally {
  //     setIsPending(false);
  //   }
  // };
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-[16px] mt-4 "
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* <InputField
          label={t("current_password")}
          type="password"
          id="current_password"
          placeholder={t("current_password")}
          {...register("current_password")}
          error={
            errors.current_password?.message
              ? t(errors.current_password?.message)
              : undefined
          }
        /> */}
        <InputField
          label={t("new_password")}
          type="password"
          id="new_password"
          placeholder={t("new_password")}
          {...register("new_password")}
          error={
            errors.new_password?.message
              ? t(errors.new_password?.message)
              : undefined
          }
        />

        <InputField
          label={t("confirm_new_password")}
          type="password"
          id="confirm_new_password"
          placeholder={t("confirm_new_password")}
          {...register("confirm_new_password")}
          error={
            errors.confirm_new_password?.message
              ? t(errors.confirm_new_password?.message)
              : undefined
          }
        />

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
