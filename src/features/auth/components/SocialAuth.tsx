import GoogleAuth from "./GoogleAuth";
import AppleAuth from "./AppleAuth";
import { useTranslations } from "next-intl";

export default function SocialAuth() {
  const t = useTranslations("auth");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-[var(--lightBorderColor)]"></span>
        <span className="text-sm text-muted-foreground">{t("or")}</span>
        <span className="h-px flex-1 bg-[var(--lightBorderColor)]"></span>
      </div>

      <GoogleAuth />
      <AppleAuth/>
    </div>
  );
}
