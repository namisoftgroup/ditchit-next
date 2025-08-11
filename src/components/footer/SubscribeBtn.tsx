"use client";

import { useState } from "react";
import SubscribeModal from "../modals/SubscribeModal";

export default function SubscribeBtn() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setShow(!show)}>
        subscribe
      </div>
      
      <SubscribeModal show={show} handleClose={() => setShow(false)} />
    </>
  );
}
