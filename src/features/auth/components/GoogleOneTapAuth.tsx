"use client";

import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { toast } from "sonner";
import { authAction } from "../actions";

import axios from "axios";

export default function GoogleOneTapAuth() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore((state) => state);

  useGoogleOneTapLogin({
    onSuccess: async (tokenResponse) => {

      console.log(tokenResponse);

      
      const res = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.credential}`,
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
          toast.success("Login successful");
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    },

    onError: () => {
      console.log("Google One Tap failed");
    },
  });

  return null;
}
