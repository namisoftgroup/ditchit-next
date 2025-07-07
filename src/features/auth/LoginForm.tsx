"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "./schema";
import { useTransition } from "react";
import { loginAction } from "./actions";
import InputField from "@/components/shared/InputField";
import FormFooterLink from "@/components/shared/FormFooterLink";
import Image from "next/image";
import SocialAuth from "./SocialAuth";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(() => {
      loginAction(formData).then((res) => {
        if (!res.success) {
          console.log(res);
        } else {
          console.log(res);
        }
      });
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]"
    >
      <Image
        className="w-full max-h-[200px] aspect-[1] object-contain"
        src="/images/login.svg"
        alt="login"
        width={500}
        height={300}
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

      <FormFooterLink
        question="Forgot your password?"
        linkText="Reset your password"
        href="/reset-password"
      />

      <button type="submit" className="customBtn w-full rounded-full">
        {isPending ? "Logging in..." : "Login"}
      </button>

      <FormFooterLink
        question="Don’t have an account?"
        linkText="Create New Account"
        href="/register"
      />

      <SocialAuth />
    </form>
  );
}
