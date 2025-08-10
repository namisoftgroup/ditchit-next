"use client";

import { useGoogleOneTapLogin } from "@react-oauth/google";

export default function GoogleOneTapAuth() {
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      console.log(credentialResponse);
    },
    
    onError: () => {
      console.log("Google One Tap failed");
    },
  });

  return null;
}
