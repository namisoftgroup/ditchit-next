"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore, useResetPasswordStore } from "../store";
import { toast } from "sonner";
import { checkCodeAction } from "../actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VerifyOtpForm() {
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const { setUser, setToken } = useAuthStore((state) => state);
  const { email } = useResetPasswordStore((state) => state);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", code);

    try {
      const res = await checkCodeAction(formData);

      if (res.code === 200) {
        setUser(res.data.user);
        setToken(res.data.auth.token);
        router.push("/reset-password/new-password");
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
      onSubmit={handleSubmit}
      className="isolate p-[30px] rounded-[14px] shadow-[var(--BigShadow)] border-none flex flex-col gap-[16px]"
    >
      <Image
        className="w-full max-h-[200px] aspect-[1] object-contain"
        src="/images/otp.svg"
        alt="login"
        width={500}
        height={300}
      />

      <p className="text-[var(--darkColor)] text-center text-[16px]">
        Please enter the verification code sent to <br />
        {email}
      </p>

      <InputOTP
        maxLength={6}
        value={code}
        onChange={(val) => {
          const filtered = val.replace(/[^0-9]/g, "");
          setCode(filtered);
        }}
        inputMode="numeric"
        type="text"
      >
        <InputOTPGroup className="grid grid-cols-6 gap-2 w-full">
          {[...Array(6)].map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="h-[64px] w-full font-bold text-[16px] bg-gray-100 border-0 rounded-[8px] data-[active=true]:border-gray-300 data-[active=true]:ring-1 data-[active=true]:ring-gray-300"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <button
        type="submit"
        className="customBtn w-full rounded-full mt-3"
        disabled={code.length !== 6 || isPending}
      >
        {isPending ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
}
