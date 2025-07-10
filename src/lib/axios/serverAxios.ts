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

  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default serverAxios;
