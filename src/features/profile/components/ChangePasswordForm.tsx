"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {  FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { changePasswordSchema, passwordSchema } from "../passwordSchema";
import InputField from "@/components/shared/InputField";

export default function ChangePasswordForm() {
  // const { user, setUser } = useAuthStore();
  // const [isPending, setIsPending] = useState(false);
  const t = useTranslations("auth");

  const methods = useForm<changePasswordSchema>({
    mode: "onChange",
    resolver: zodResolver(passwordSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

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
  const handleFormSubmit = (data: changePasswordSchema) => {
    console.log(data);
  };
  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-[16px]"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <InputField
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
        />
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
          // disabled={isPending}
        >
          {/* {isPending ? t("loading") : t("update")} */}
          {t("update")}
        </button>
      </form>
    </FormProvider>
  );
}
