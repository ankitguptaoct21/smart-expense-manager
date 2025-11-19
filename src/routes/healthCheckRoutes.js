import { Router } from "express";
import { healthCheckControllers } from "../controllers/index.js"

const healthCheckRoutes = () => {
    const healthRoutes = Router();

    healthRoutes.get("/status", healthCheckControllers.getStatus);

    return healthRoutes;
}

export default healthCheckRoutes;
