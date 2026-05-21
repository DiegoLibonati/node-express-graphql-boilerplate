import { NoSchemaIntrospectionCustomRule } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

import type { NextFunction, Request, Response } from "express";

import { envs } from "@/configs/env.config";

import { schema } from "@/schemas/schema";

const validationRules = envs.GRAPHQL_INTROSPECTION ? [] : [NoSchemaIntrospectionCustomRule];

const graphqlHandler = createHandler({ schema, validationRules });

export const GraphController = {
  handler: (req: Request, res: Response, next: NextFunction): void => {
    graphqlHandler(req, res, next);
  },

  graphiql: (_req: Request, res: Response, next: NextFunction): void => {
    try {
      res.setHeader("Content-Type", "text/html");
      res.setHeader(
        "Content-Security-Policy",
        [
          "default-src 'self' https://unpkg.com",
          "script-src 'self' 'unsafe-inline' https://unpkg.com",
          "style-src 'self' 'unsafe-inline' https://unpkg.com",
          "connect-src 'self' https://unpkg.com",
          "img-src 'self' data: https://unpkg.com",
          "font-src 'self' data: https://unpkg.com",
        ].join("; "),
      );
      res.send(ruruHTML({ endpoint: "/api/v1/graphql" }));
    } catch (e) {
      next(e);
    }
  },
};
