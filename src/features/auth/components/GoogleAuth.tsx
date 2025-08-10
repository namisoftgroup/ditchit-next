"use client";

import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";

export default function GoogleAuth() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google token:", tokenResponse);
      // Here you can fetch user info with:
      // fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      //   headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      // })
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
      <span className="flex-1 text-center text-sm">Continue with Google</span>
    </div>
  );
}
