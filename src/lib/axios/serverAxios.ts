"use server";

import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { API_URL } from "@/utils/constants";

const serverAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

serverAxios.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("token")?.value;
  const locale = (await cookies()).get("NEXT_LOCALE")?.value;

  const baseLocale = locale?.split("-")[0];
  const country = locale?.split("-")[1];

  const normalizedLocale =
    baseLocale === "zh" ? "zh-CN" : baseLocale === "pt" ? "pt-BR" : baseLocale;

  if (normalizedLocale) {
    config.headers["lang"] = normalizedLocale;
  }

  if (country) {
    config.headers["country"] = country;
  }

  config.headers.Authorization = token;

  return config;
});

export default serverAxios;
