"use client";

import { JSX, ClassAttributes, ButtonHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AppleSignin from "react-apple-signin-auth";

export default function AppleAuth() {
  const t = useTranslations("auth");

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
        scope: process.env.NEXT_PUBLIC_APPLE_SCOPE!,
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
        redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
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
            {t("continue_with_apple")}
          </span>
        </button>
      )}
    />
  );
}
// -------------------------------------------------------------------------
// "use client";

// import Image from "next/image";
// import { useTranslations } from "next-intl";

// export default function AppleAuth() {
//   const t = useTranslations("auth");

//   const handleAppleSignIn = () => {
//     try {
//       // Build the Apple authorization URL
//       const params = new URLSearchParams({
//         response_type: "code id_token",
//         response_mode: "form_post",
//         client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
//         redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
//         scope: "name email",
//       });

//       // Redirect user to Apple sign-in page
//       window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
//     } catch (error) {
//       console.error("Error starting Apple sign-in:", error);
//       alert("Something went wrong with Apple sign-in. Please try again.");
//     }
//   };

//   return (
//     <button
//       type="button"
//       onClick={handleAppleSignIn}
//       className="whitespace-nowrap rounded-full flex-1 flex items-center justify-center px-6 py-3 gap-2 border cursor-pointer"
//     >
//       <Image src="/icons/apple.svg" alt="apple" width={24} height={24} />
//       <span className="flex-1 text-center text-sm">
//         {t("continue_with_apple")}
//       </span>
//     </button>
//   );
// }
// -------------------------------------------------------------------------
