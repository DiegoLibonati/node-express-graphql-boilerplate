import type { Env, LogLevel } from "@/types/app";

export interface Envs {
  PORT: number;
  ENV: Env;
  BASE_URL: string;
  API_URL: string;
  HTTP_TIMEOUT_MS: number;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX: number;
  GRAPHIQL_ENABLED: boolean;
  GRAPHQL_INTROSPECTION: boolean;
  LOG_LEVEL: LogLevel;
  BODY_LIMIT: string;
  SEED_DEFAULT_DATA: boolean;
}
