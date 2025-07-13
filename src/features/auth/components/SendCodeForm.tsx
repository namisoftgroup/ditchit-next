"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useResetPasswordStore } from "../store";
import { sendCode } from "../service";
import InputField from "@/components/shared/InputField";
import Image from "next/image";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function SendCodeForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const setEmail = useResetPasswordStore((state) => state.setEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    mode: "onChange",
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (values: EmailFormValues) => {
    setIsPending(true);
    try {
      const res = await sendCode(values.email);
      
      if (res.code === 200) {
        setEmail(values.email);
        router.push("/reset-password/verify-otp");
        toast.success(`Code sent successfully to your email: ${values.email}`);
      } else {
        toast.error(res.message || "Failed to send code");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]"
      onSubmit={handleSubmit(onSubmit)}
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
        placeholder="example@example.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <button type="submit" className="customBtn w-full rounded-full mt-3" disabled={isPending}>
        {isPending ? "Sending..." : "Send Code"}
      </button>
    </form>
  );
}
