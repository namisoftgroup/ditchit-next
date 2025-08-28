"use client";
import { useTranslations } from "next-intl";

export default function DitchNote() {
  const t = useTranslations("ditchNote");

  return (
    <div className="p-6 border border-[var(--lightBorderColor)] rounded-[16px] bg-[var(--whiteColor)]">
      <h4 className="font-bold text-[18px] mb-4 pb-4 border-b border-b-[var(--lightBorderColor)]">
        {t("title")}
      </h4>

      <ul>
        <li className="flex flex-wrap p-4 rounded-[16px] gap-2">
          <p className="font-bold text-[14px]">{t("point1")}</p>
        </li>
        <li className="flex flex-wrap p-4 rounded-[16px] gap-2 bg-[#f5f5f5]">
          <p className="font-bold text-[14px]">{t("point2")}</p>
        </li>
      </ul>
    </div>
  );
}
