"use client";

import { useLottie } from "lottie-react";
import noData from "@/assets/lotties/nodata.json";

export default function NoDataPlaceHolder() {
  const defaultOptions = {
    animationData: noData,
    loop: true,
    width: 300,
  };

  const { View } = useLottie(defaultOptions);

  return <div className="w-[350px]">{View}</div>;
}
