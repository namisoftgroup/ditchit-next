"use client";

import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/utils/constants";
import { useAuthStore } from "@/features/auth/store";

const clientAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const getLocaleFromCookie = (): string => {
  if (typeof window === "undefined") return "en";

  const cookies = document.cookie.split(";")
  const localeCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("NEXT_LOCALE=")
  );

  if (localeCookie) {
    return localeCookie.split("=")[1]?.trim().split("-")[0] || "en";
  }

  return "en";
};

clientAxios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const locale = getLocaleFromCookie();

    config.headers.Authorization = token;
    config.headers["lang"] = locale;

    return config;
  },
  (error) => Promise.reject(error)
);

export default clientAxios;
