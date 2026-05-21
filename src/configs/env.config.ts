import { z } from "zod";

import type { Envs } from "@/types/env";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5050),
  BASE_URL: z.string().default(""),
  API_URL: z.url(),
  HTTP_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().nonnegative().default(100),
  // Sin default: el toggle final depende de NODE_ENV (ver más abajo).
  GRAPHIQL_ENABLED: z.stringbool().optional(),
  GRAPHQL_INTROSPECTION: z.stringbool().optional(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  BODY_LIMIT: z.string().default("1gb"),
  SEED_DEFAULT_DATA: z.stringbool().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

// GraphiQL / introspection: en producción defaultean a false, en dev/test a true.
const isProd = parsed.data.NODE_ENV === "production";

export const envs: Envs = {
  ENV: parsed.data.NODE_ENV,
  PORT: parsed.data.PORT,
  BASE_URL: parsed.data.BASE_URL,
  API_URL: parsed.data.API_URL,
  HTTP_TIMEOUT_MS: parsed.data.HTTP_TIMEOUT_MS,
  RATE_LIMIT_WINDOW_MS: parsed.data.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX: parsed.data.RATE_LIMIT_MAX,
  GRAPHIQL_ENABLED: parsed.data.GRAPHIQL_ENABLED ?? !isProd,
  GRAPHQL_INTROSPECTION: parsed.data.GRAPHQL_INTROSPECTION ?? !isProd,
  LOG_LEVEL: parsed.data.LOG_LEVEL,
  BODY_LIMIT: parsed.data.BODY_LIMIT,
  SEED_DEFAULT_DATA: parsed.data.SEED_DEFAULT_DATA,
};
