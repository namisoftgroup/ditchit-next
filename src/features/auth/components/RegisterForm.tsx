"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { registerFormValues, registerSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authAction } from "../actions";
import { useAuthStore } from "../store";
import InputField from "@/components/shared/InputField";
import SocialAuth from "./SocialAuth";
import ZipMapSearch from "./ZipMapSearch";
import FormFooterLink from "./FormFooterLink";

export default function RegisterForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { setUser, setToken } = useAuthStore((state) => state);
  const router = useRouter();

  const methods = useForm<registerFormValues>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: registerFormValues) => {
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
      const res = await authAction(formData, "/auth/register");

      if (res?.code === 200) {
        setUser(res.data.user);
        setToken(res.data.auth.token);
        toast.success("Register successful");
        router.push("/");
      } else {
        toast.error(res?.message || "Registration failed");
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
        className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AvatarUpload onImageChange={(file) => setValue("image", file)} />

        <InputField
          label="User Name"
          id="username"
          placeholder="User Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <InputField
          label="Phone Number"
          id="phone"
          placeholder="(123) 456-7890"
          {...register("phone")}
          error={errors.phone?.message}
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
          className="customBtn w-full rounded-full"
          disabled={isPending}
        >
          {isPending ? "Registering..." : "Register"}
        </button>

        <FormFooterLink
          question="Already have an account?"
          linkText="Login"
          href="/login"
        />

        <SocialAuth />
      </form>
    </FormProvider>
  );
}
