"use client";

import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore, useResetPasswordStore } from "../store";
import { toast } from "sonner";
import { checkCodeAction } from "../actions";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getCookie } from "@/lib/utils";
import { sendCode } from "../service";

export default function VerifyOtpForm() {
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [timer, setTimer] = useState(60);
  const router = useRouter();
  const t = useTranslations("auth");
  const { user } = useAuthStore();
  const { setUser, setToken } = useAuthStore((state) => state);
  const { email } = useResetPasswordStore((state) => state);
  const url = typeof window !== "undefined" ? window.location.href : "";

  // count timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData();
    
    formData.append("email", user?.email || email) 
    formData.append("code", code);

    try {
      const res = await checkCodeAction(formData);

      if (res.code === 200) {
        // document.cookie =
        //   "verifyEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setUser(res.data.user);
        setToken(res.data.auth.token);

        if (url.includes("reset-password")) {
          router.push("/reset-password/new-password");
        } else if (url.includes("profile")) {
          router.push("/profile/change-password");
        }
        toast.success(t("verified_success"));
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(t("something_went_wrong"));
    } finally {
      setIsPending(false);
    }
  };

  const resendCode = async () => {
    if (!navigator.onLine) {
      toast.error(t("offline"));
      return;
    }
    setIsPending(true);
    try {
      const verifyEmail = getCookie("verifyEmail");
      if (!verifyEmail) {
        toast.error(t("error.missing_email"));
        return;
      }
      const res = await sendCode(verifyEmail);

      if (res.code === 200) {
        setTimer(60);
        toast.success(t("code_sent", { email: verifyEmail }));
      } else {
        toast.error(res.message || "Failed to send code");
      }
    } catch (error) {
      console.error(error);
      toast.error(t("offline"));
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
        {t("enter_code_sent_to")} <br />
        {email || user?.email}
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
      <div className="flex items-center justify-center gap-2 mt-2">
        {timer === 0 ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              resendCode();
            }}
            className="text-green-600 underline cursor-pointer "
          >
            {t("resend_code")}
          </button>
        ) : (
          <p className="text-gray-700">{t("timer_count")}</p>
        )}
        {timer === 0 ? <p></p> : <p className="text-green-600">{timer}s</p>}
      </div>

      <button
        type="submit"
        className="customBtn w-full rounded-full mt-3"
        disabled={code.length !== 6 || isPending}
      >
        {isPending ? t("loading") : t("verify_otp")}
      </button>
    </form>
  );
}
