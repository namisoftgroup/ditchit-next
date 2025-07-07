"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function useUrlFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const getMultiParam = (key: string): string[] => {
    const raw = searchParams.get(key);
    return raw ? raw.split("-") : [];
  };

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const setMultiParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join("-"));
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const toggleMultiParam = (key: string, value: string) => {
    const current = getMultiParam(key);
    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setMultiParam(key, newValues);
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`);
  };

  return {
    getParam,
    getMultiParam,
    setParam,
    setMultiParam,
    toggleMultiParam,
    removeParam,
  };
}
