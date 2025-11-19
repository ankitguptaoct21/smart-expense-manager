import { Router } from "express";

import healthCheckRoutes from "./healthCheckRoutes.js";

const apiRoutes = () => {
    const router = Router();

    router.use("/health-check", healthCheckRoutes());

    return router;
}

export default apiRoutes;
