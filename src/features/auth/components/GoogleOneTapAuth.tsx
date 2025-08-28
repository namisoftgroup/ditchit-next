"use client";

import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { toast } from "sonner";
import { authAction } from "../actions";
import { jwtDecode } from "jwt-decode";
import { useTranslations } from "next-intl";

export default function GoogleOneTapAuth() {
  const router = useRouter();
  const t = useTranslations("auth");
  const { setUser, setToken } = useAuthStore((state) => state);

  interface GoogleJwtPayload {
    email: string;
    name: string;
    sub: string;
  }

  useGoogleOneTapLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = jwtDecode<GoogleJwtPayload>(
          tokenResponse.credential as string
        );

        const formData = new FormData();
        formData.append("email", userInfo.email);
        formData.append("name", userInfo.name);
        formData.append("social_id", userInfo.sub);
        formData.append("social_type", "google");

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
        console.error(error);
        toast.error(t("something_went_wrong"));
      }
    },

    onError: () => {
      console.log("Google One Tap failed");
    },
  });

  return null;
}
