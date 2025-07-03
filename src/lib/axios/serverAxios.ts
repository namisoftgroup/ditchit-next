import axios, { AxiosInstance } from "axios";
import { API_URL } from "@/utils/constants";

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

const serverAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
});

export default serverAxios;
