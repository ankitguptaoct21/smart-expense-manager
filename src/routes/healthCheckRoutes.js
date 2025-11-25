import { Router } from "express";

import { healthCheckController } from "../controllers/index.js"

const healthCheckRoutes = () => {
    const healthCheckRoutes = Router();

    healthCheckRoutes.get("/status", healthCheckController.getStatus);

    return healthCheckRoutes;
}

export default healthCheckRoutes;
