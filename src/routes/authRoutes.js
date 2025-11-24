import { Router } from "express";
import { authControllers } from "../controllers/index.js"

const authRoutes = () => {
    const authRoutes = Router();

    authRoutes.post("/signup", authControllers.signup);
    authRoutes.post("/signin", authControllers.signin);

    return authRoutes;
}

export default authRoutes;
