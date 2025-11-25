import { Router } from "express";

import { healthCheckController } from "../controllers/index.js"

const healthCheckRoutes = () => {
    const healthCheckRoutes = Router();

    /**
     * @swagger
     * /api/health-check/status:
     *   get:
     *     summary: Health check endpoint
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Service is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: ok
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     */
    healthCheckRoutes.get("/status", healthCheckController.getStatus);

    return healthCheckRoutes;
}

export default healthCheckRoutes;
