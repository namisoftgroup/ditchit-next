"use client";

import { createContext, useContext, useState } from "react";
const PostFormContext = createContext<unknown>(null);
export const usePostForm = () => useContext(PostFormContext);

export default function PostFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [step, setStep] = useState(0);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  return (
    <PostFormContext.Provider value={{ step, next, back }}>
      {children}
    </PostFormContext.Provider>
  );
}
