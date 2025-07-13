"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPassFormValues, resetPassSchema } from "../schema";
import { API_URL } from "@/utils/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InputField from "@/components/shared/InputField";
import clientAxios from "@/lib/axios/clientAxios";

export default function NewPasswordForm() {
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
      });

      if (res.data.code === 200) {
        toast.success("Password updated successfully");
        router.push("/profile");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
        label="Password"
        type="password"
        id="password"
        placeholder="Password"
        {...register("password")}
        error={errors.password?.message}
      />

      <InputField
        label="Password Confirmation"
        type="password"
        id="passwordConfirmation"
        placeholder="Password"
        {...register("confirm_password")}
        error={errors.confirm_password?.message}
      />

      <button
        type="submit"
        className="customBtn w-full rounded-full mt-3"
        disabled={isPending}
      >
        {isPending ? "updating..." : "Reset Password"}
      </button>
    </form>
  );
}
