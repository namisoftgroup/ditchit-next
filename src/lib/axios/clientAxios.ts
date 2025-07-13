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

clientAxios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default clientAxios;
