import type { ZodType } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    id: string;
  }
}

export type Env = "development" | "production" | "test";

export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";

export interface ValidateConfig {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}
