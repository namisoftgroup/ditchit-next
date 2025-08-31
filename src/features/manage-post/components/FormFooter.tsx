import { useTranslations } from "next-intl";
import Image from "next/image";

export default function FormFooter({
  back,
  nextBtnText,
  showBackBtn = true,
}: {
  back?: () => void;
  showBackBtn?: boolean;
  nextBtnText?: string;
}) {
  const t = useTranslations("manage_post");

  return (
    <div
      className={`flex mt-6 ${showBackBtn ? "justify-between" : "justify-end"}`}
    >
      {showBackBtn && (
        <button
          className="rounded-[12px] text-[var(--whiteColor)] text-[14px] px-6 py-3 bg-black flex justify-center items-center gap-1 capitalize"
          onClick={back}
        >
          <Image
            src="/icons/arrow.svg"
            alt="prev"
            width={14}
            height={14}
            className="brightness-0 invert rtl:scale-x-[-1]"
          />
          {t("previous")}
        </button>
      )}

      <button className="rounded-[12px] text-[14px] text-[var(--whiteColor)] px-6 py-3 bg-[var(--mainColor)] flex justify-center items-center gap-1 capitalize">
        {nextBtnText ? nextBtnText : t("next")}
        <Image
          src="/icons/arrow.svg"
          alt="Next"
          width={14}
          height={14}
          className="brightness-0 invert ltr:scale-x-[-1]"
        />
      </button>
    </div>
  );
}
