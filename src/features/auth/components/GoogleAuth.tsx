"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { authAction } from "../actions";
import { useAuthStore } from "../store";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";

export default function GoogleAuth() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore((state) => state);
  const t = useTranslations("auth");

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      const formData = new FormData();

      formData.append("email", res.data.email);
      formData.append("name", res.data.name);
      formData.append("social_type", "google");
      formData.append("social_id", res.data.sub);

      try {
        const res = await authAction(formData, "/auth/socialLogin");

        if (res.code === 200) {
          setUser(res.data.user);
          setToken(res.data.auth.token);
          router.push("/");
          toast.success(t("login_success"));
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(t("something_went_wrong"));
      }
    },
    onError: () => {
      console.log("Google login failed");
    },
  });

  return (
    <div
      className="whitespace-nowrap rounded-full flex-1 flex items-center justify-center px-6 py-3 gap-2 bg-[#4c8bf5] text-[var(--whiteColor)] cursor-pointer"
      onClick={() => login()}
    >
      <Image src="/icons/google.svg" alt="google" width={24} height={24} />
      <span className="flex-1 text-center text-sm">
        {t("continue_with_google")}
      </span>
    </div>
  );
}
