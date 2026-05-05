import type { Env } from "@/types/app";
import type { Envs } from "@/types/env";

import { requireEnv } from "@/helpers/require_env.helper";

const API_URL = requireEnv("API_URL");

export const envs: Envs = {
  PORT: Number(process.env.PORT) || 5050,
  ENV: (process.env.NODE_ENV ?? "development") as Env,
  BASE_URL: process.env.BASE_URL ?? "",
  API_URL: API_URL,
};
