import { Router } from "express";

import healthRoutes from "@/routes/v1/health.route";
import graphRoutes from "@/routes/v1/graph.route";

const router = Router();

router.use("/health", healthRoutes);
router.use(graphRoutes);

export default router;
