"use client";

import { useLottie } from "lottie-react";
import chat from "@/lotties/chat.json";

export default function ChatPlaceHolder() {
  const defaultOptions = {
    animationData: chat,
    loop: true,
    width: 300,
  };

  const { View } = useLottie(defaultOptions);

  return (
    <div className="w-full bg-[#fafafa] flex flex-col items-center justify-center gap-3 rounded-[14px] h-full">
      <div className="w-[350px]">{View}</div>
      <h6 className="text-[16px] font-bold">open or start conversation here</h6>
    </div>
  );
}
