import { Router } from "express";

import healthCheckRoutes from "./healthCheckRoutes.js";
import authRoutes from "./authRoutes.js";

const apiRoutes = () => {
    const router = Router();

    router.use("/health-check", healthCheckRoutes());
    router.use("/auth", authRoutes());

    return router;
}

export default apiRoutes;
