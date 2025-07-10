"use client";

import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/utils/constants";

const clientAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default clientAxios;
