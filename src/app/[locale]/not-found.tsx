import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("error");

  return (
    <div className="min-h-[calc(100vh-316px)] py-24 h-full flex items-center flex-col justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4">
      <div className="max-w-lg w-full rounded-2xl backdrop-blur-md">
        <div className="flex flex-col items-center text-center space-y-5">
          <h1 className="text-9xl mb-5 font-extrabold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-lg">
            404
          </h1>

          <h2 className="text-3xl font-extrabold text-red-700 tracking-tight">
            {t("page_not_found")}
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600">
             {t("not_found_text")}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          >
            {t("back_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
