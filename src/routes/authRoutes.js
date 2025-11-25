import { Router } from "express";

import { authController } from "../controllers/index.js"

const authRoutes = () => {
    const authRoutes = Router();

    authRoutes.post("/signup", authController.signup);
    authRoutes.post("/signin", authController.signin);
    authRoutes.post("/change-password", authController.changePassword);
    // Add logout route here

    return authRoutes;
}

export default authRoutes;
