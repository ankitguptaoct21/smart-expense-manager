import { Router } from "express";

import healthCheckRoutes from "./healthCheckRoutes.js";
import authRoutes from "./authRoutes.js";
import expenseRoutes from "./expenseRoutes.js";

const apiRoutes = () => {
    const router = Router();

    router.use("/health-check", healthCheckRoutes());
    router.use("/auth", authRoutes());
    router.use("/expenses", expenseRoutes());

    return router;
}

export default apiRoutes;
