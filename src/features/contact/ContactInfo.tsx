import { Setting } from "@/services/getSettings";
import { MailIcon, MapPinIcon } from "lucide-react";
import { useTranslations } from "next-intl";


export default function ContactInfo({ data }: { data: Setting }) {
  const t = useTranslations("contact")

  return (
    <div className="w-full h-full rounded-2xl p-6 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.102)]">
      <h3 className="text-[20px] font-bold text-[var(--primaryColor)] mb-3">
       {t("stay_in_touch")}
      </h3>
      <p className="text-[14px] text-[#777]">
       {t("contact_text")}
      </p>

      <ul className="mt-10">
        <li className="w-full flex mb-8 gap-4 items-center">
          <div className="min-w-12 h-12 rounded-full border border-[var(--mainColor)] overflow-hidden isolate relative flex items-center justify-center text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white">
            <MapPinIcon width={20} height={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="mb-1 text-[var(--mainColor)] text-[13px] font-bold">
              {t("address")} :
            </h4>
            <a target="_blank" href="#" className="text-[14px] text-[#777]">
              8 THE GRN STE B Dover, DE 19901,USA
            </a>
          </div>
        </li>

        <li className="w-full flex mb-8 gap-4 items-center">
          <div className="min-w-12 h-12 rounded-full border border-[var(--mainColor)] overflow-hidden isolate relative flex items-center justify-center text-[var(--mainColor)] hover:bg-[var(--mainColor)] hover:text-white">
            <MailIcon width={20} height={20} />
          </div>
          <div className="flex flex-col">
            <h4 className="mb-1 text-[var(--mainColor)] text-[13px] font-bold">
              {t("email")} :
            </h4>
            <a
              target="_blank"
              href={`mailto:${data?.email}`}
              className="text-[14px] text-[#777]"
            >
              {data?.email}
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
