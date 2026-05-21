import { Router } from "express";

import { envs } from "@/configs/env.config";

import { GraphController } from "@/controllers/graph.controller";

import { rateLimiter } from "@/middlewares/rate_limit.middleware";

const router = Router();

router.use("/graphql", rateLimiter, GraphController.handler);

// GraphiQL queda gateado por env (default: sólo en non-production).
if (envs.GRAPHIQL_ENABLED) {
  router.get("/graphiql", GraphController.graphiql);
}

export default router;
