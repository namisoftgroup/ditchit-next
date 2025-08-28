"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="min-h-[calc(100vh-316px)] py-24 h-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4">
      <div className="max-w-lg w-full rounded-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="p-4 bg-red-100 rounded-full shadow-inner">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-3xl font-extrabold text-red-700 tracking-tight">
            {t("somthing_went_wrong")}
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600">{t("inconvenience")}</p>
            <p className="text-sm text-gray-500 break-all">
              {error.message || "Unknown error"}
            </p>
          </div>

          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 transition-all duration-200"
          >
            {t("try_again")}
          </button>
        </div>
      </div>
    </div>
  );
}
