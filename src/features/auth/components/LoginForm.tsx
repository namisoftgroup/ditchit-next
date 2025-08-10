"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../store";
import { authAction } from "../actions";
import InputField from "@/components/shared/InputField";
import FormFooterLink from "@/features/auth/components/FormFooterLink";
import Image from "next/image";
import SocialAuth from "./SocialAuth";

export default function LoginForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsPending(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      const res = await authAction(formData, "/auth/login");

      if (res.code === 200) {
        setUser(res.data.user);
        setToken(res.data.auth.token);
        router.push("/");
        toast.success("Login successful");
      } else {
        toast.error(res.message);
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

      <button type="submit" className="customBtn w-full rounded-full" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>

      <FormFooterLink
        question="Don't have an account?"
        linkText="Create New Account"
        href="/register"
      />

      <SocialAuth />
    </form>
  );
}
