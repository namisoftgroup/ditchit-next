"use client";

import Image from "next/image";
import { JSX, ClassAttributes, ButtonHTMLAttributes } from "react";
import AppleSignin from "react-apple-signin-auth";

export default function AppleAuth() {
  const handleSuccess = (response: {
    authorization: { id_token: string; code: string };
    user?: { email: string; name: string };
  }) => {
    console.log("Apple Response:", response);
  };

  const handleError = (error: Error) => {
    console.error("Apple Signin Error:", error);
  };

  return (
    <AppleSignin
      uiType="dark"
      authOptions={{
        clientId: "com.ditchit.webapp",
        scope: "name email",
        redirectURI: "https://ditchit.com/auth/apple/callback",
        usePopup: true,
      }}
      onSuccess={handleSuccess}
      onError={handleError}
      render={(
        props: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLButtonElement> &
          ButtonHTMLAttributes<HTMLButtonElement>
      ) => (
        <button
          {...props}
          type="button"
          className="whitespace-nowrap rounded-full flex-1 flex items-center justify-center px-6 py-3 gap-2 border cursor-pointer"
        >
          <Image src="/icons/apple.svg" alt="apple" width={24} height={24} />
          <span className="flex-1 text-center text-sm">
            Continue with Apple
          </span>
        </button>
      )}
    />
  );
}
