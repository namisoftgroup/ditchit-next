"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import GetAppModal from "../modals/GetAppModal";

export default function GetApp() {
  const [show, setShow] = useState<boolean>(false);
  const t = useTranslations("header");

  return (
    <>
      <button
        className="m-0 rounded-full capitalize px-5 py-2 w-auto whitespace-nowrap cursor-pointer customBtn hidden md:block hover:text-[var(--mainColor)]"
        onClick={() => setShow(true)}
      >
        {t("get_app")}
      </button>

      <GetAppModal show={show} handleClose={() => setShow(false)} />
    </>
  );
}
