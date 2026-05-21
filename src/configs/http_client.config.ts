import axios, { type AxiosInstance } from "axios";

import { envs } from "@/configs/env.config";

export const httpClient: AxiosInstance = axios.create({
  baseURL: envs.API_URL,
  timeout: envs.HTTP_TIMEOUT_MS,
});
