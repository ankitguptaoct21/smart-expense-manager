import { Router } from "express";
import { healthCheckControllers } from "../controllers/index.js"

const healthCheckRoutes = () => {
    const healthCheckRoutes = Router();

    healthCheckRoutes.get("/status", healthCheckControllers.getStatus);

    return healthCheckRoutes;
}

export default healthCheckRoutes;
