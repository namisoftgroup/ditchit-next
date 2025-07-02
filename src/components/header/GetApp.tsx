"use client";

import { useState } from "react";
import GetAppModal from "../modals/GetAppModal";

export default function GetApp() {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <button
        className="m-0 rounded-full capitalize px-5 py-2 w-auto whitespace-nowrap cursor-pointer customBtn"
        onClick={() => setShow(true)}
      >
        get the app
      </button>

      <GetAppModal show={show} handleClose={() => setShow(false)} />
    </>
  );
}
