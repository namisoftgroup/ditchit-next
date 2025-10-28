"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPassFormValues, resetPassSchema } from "../schema";
import { API_URL } from "@/utils/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import InputField from "@/components/shared/InputField";
import clientAxios from "@/lib/axios/clientAxios";

export default function NewPasswordForm() {
  const t = useTranslations("auth");

  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassFormValues>({
    mode: "onChange",
    resolver: zodResolver(resetPassSchema),
  });

  const onSubmit = async (values: ResetPassFormValues) => {
    setIsPending(true);

    try {
      const res = await clientAxios.post(API_URL + "/auth/updatePassword", {
        password: values.password,
        type: "reset",
      });

      if (res.data.code === 200) {
        toast.success(t("password_updated"));
        router.push("/login");
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

  return (
    <form
      className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]"
      onSubmit={handleSubmit(onSubmit)}
    >
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
        label={t("password_confirmation")}
        type="password"
        id="passwordConfirmation"
        placeholder={t("password")}
        {...register("confirm_password")}
        error={
          errors.confirm_password?.message
            ? t(errors.confirm_password?.message)
            : undefined
        }
      />

      <button
        type="submit"
        className="customBtn w-full rounded-full mt-3"
        disabled={isPending}
      >
        {isPending ? t("loading") : t("reset_password")}
      </button>
    </form>
  );
}

// import { useAuthStore } from "../store";
// const { logout } = useAuthStore((state) => ({ logout: state.logout }));

// if (res.data.code === 200) {
//   toast.success(t("password_updated"));
//   // Invalidate existing auth token (if any) by calling the logout endpoint
//   try {
//     await clientAxios.get(API_URL + "/profile/logout");
//   } catch (err) {
//     // Ignore errors; the goal is to ensure cookie removal even if request fails
//     console.error("Failed to hit logout endpoint", err);
//   }
//   // Clear auth state on client side
//   logout();
//   // Navigate user to login page after successful password reset
//   router.push("/login");
// } else {
//   toast.error(res.data.message);
// }
