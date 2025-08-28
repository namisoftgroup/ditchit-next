"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import SubscribeModal from "../modals/SubscribeModal";

export default function SubscribeBtn() {
  const t = useTranslations("common");
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setShow(!show)}>
        {t("subscribe")}
      </div>

      <SubscribeModal show={show} handleClose={() => setShow(false)} />
    </>
  );
}
